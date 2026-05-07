terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.37.0"
    }
    random = {
      source = "opentofu/random"
      version = "3.8.1"
    }
  }
}

provider "aws" {
  region  = "us-east-2"
  profile = "AdminAccess"
}



# --- Secrets Manager ---
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "rds-db-credentials"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db_credentials_value" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
  	db_url = "jdbc:postgresql://${aws_db_instance.db.address}/${var.db_name}"
    db_username = var.db_username
    db_password = random_password.db_password.result
    db_name = var.db_name
    user_pool_id = aws_cognito_user_pool.main.id
  })
}



# --- Cognito user pool ---
resource "aws_cognito_user_pool" "main" {
  name = "user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  schema {
    name     = "email"
    required = true
    attribute_data_type = "String"
  }

  schema {
    name     = "preferred_username"
    required = true
    attribute_data_type = "String"
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
}



# --- User pool client & Identity pool ---
resource "aws_cognito_user_pool_client" "client" {
  name         = "app-client"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "identity pool"
  allow_unauthenticated_identities = false
  allow_classic_flow               = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = false
  }
}

# --- RDS ---
resource "aws_db_instance" "db" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t4g.micro"
  multi_az = false

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  # no backups
  skip_final_snapshot  = true
  backup_retention_period = 0
  deletion_protection = false

  publicly_accessible = false
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}

resource "aws_security_group_rule" "rds_ingress_from_ec2" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.ec2_sg.id
  description              = "Allow Postgres in from EC2"
}

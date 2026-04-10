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




# --- Credentials ---
variable "db_name" {
  type        = string
  description = "RDS database name"
  default     = "appdb"
  sensitive   = false
}

variable "database_url" {
  type = string
  description = "connection string for the RDS database"
  default = "postgres://${aws_db_instance.db.username}:${aws_db_instance.db.password}@${aws_db_instance.db.endpoint}/${aws_db_instance.db.db_name}"
  sensitive = true
}

resource "random_password" "db_password" {
  length  = 16
  special = true
  override_special = "!#$%&*?"
}



# --- EC2 ---
resource "aws_instance" "example" {
  ami           = "ami-123"
  instance_type = "t4g.nano"

  user_data = <<-EOF
    #!/bin/bash
    echo "export DB_URL=${var.database_url}" >> /etc/profile
  EOF
}



# --- Secrets Manager ---
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "rds-db-credentials"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db_credentials_value" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
  	db_url = "jdbc:postgresql://${aws_db_instance.db.address}/${aws_db_instance.db.db_name}"
    username = "dbuser"
    password = random_password.db_password.result
  })
}

locals {
  db_creds = jsondecode(
    aws_secretsmanager_secret_version.db_credentials_value.secret_string
  )
}



# --- VPC ---
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}



# --- Subnets ---
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

resource "aws_subnet" "subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = local.azs[0]
}

resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = local.azs[1]
}



# --- VPC endpoint ---
resource "aws_vpc_endpoint" "secretsmanager_vpc_endpoint" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-2.secretsmanager"
  vpc_endpoint_type = "Interface"
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.subnet.id,
    aws_subnet.subnet_2.id
  ]

  security_group_ids = [aws_security_group.vpcendpoint_sg.id]
}



# --- Security Groups ---
resource "aws_security_group" "lambda_sg" {
  vpc_id      = aws_vpc.main.id
  description = "Lambda function security group"
}

resource "aws_security_group" "vpcendpoint_sg" {
  vpc_id      = aws_vpc.main.id
  description = "Secrets Manager VPC endpoint security group"
}

resource "aws_security_group" "rds_sg" {
  vpc_id      = aws_vpc.main.id
  description = "RDS security group"
}

resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet-group"
  subnet_ids = [aws_subnet.subnet.id, aws_subnet.subnet_2.id]
}



# --- Security Group rules ---
# lambda sg rules
resource "aws_security_group_rule" "lambda_egress_to_endpoint" {
  type                     = "egress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.lambda_sg.id
  source_security_group_id = aws_security_group.vpcendpoint_sg.id
  description              = "Allow HTTPS out to Secrets Manager VPC endpoint"
}

resource "aws_security_group_rule" "lambda_egress_to_rds" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.lambda_sg.id
  source_security_group_id = aws_security_group.rds_sg.id
  description              = "Allow Postgres out to RDS"
}

# vpc endpoint sg rules
resource "aws_security_group_rule" "endpoint_ingress_from_lambda" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.vpcendpoint_sg.id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow HTTPS in from Lambda"
}

resource "aws_security_group_rule" "endpoint_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.vpcendpoint_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound (required for endpoint ENI responses)"
}

# rds sg rules
resource "aws_security_group_rule" "rds_ingress_from_lambda" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow Postgres in from Lambda"
}



# --- Lambda function ---
# Package the Lambda function code
data "archive_file" "lambda_create_user" {
  type        = "zip"
  source_dir = "${path.module}/lambda"
  output_path = "${path.module}/lambda/function.zip"
}

resource "aws_lambda_function" "post_confirm" {
  function_name = "post-confirmation-handler"
  filename      = data.archive_file.lambda_create_user.output_path
  role 			= aws_iam_role.lambda_iam_role.arn
  handler       = "index.handler"
  runtime = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_create_user.output_base64sha256

  timeout = 15

  vpc_config {
	subnet_ids = [
	  aws_subnet.subnet.id,
	  aws_subnet.subnet_2.id
	]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      DB_HOST = aws_db_instance.db.address
      DB_NAME = var.db_name
    }
  }
}


# --- IAM Roles ---

# IAM Role and Policy Attachment for Spring boot backend
resource "aws_iam_role" "ec2_iam_role" {
	name = "ec2-instance-role"

	assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# IAM Role and Policy Attachment for lambda
resource "aws_iam_role" "lambda_iam_role" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# IAM policy to access secrets
resource "aws_iam_policy" "secrets_policy" {
  name = "secrets-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.db_credentials.arn
      }
    ]
  })
}

resource "aws_iam_policy" "rds_policy" {
	name = "rds-policy"

	policy = jsondecode({
		Version: "2012-10-17",
		Statement: [{
			Effect: "Allow",
			Action: [
				"rds-db:connect"
			],
			Resource: aws_db_instance.db.arn
		}]
	})
}

# Attach iam policies to the iam roles
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_secrets_attach" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = aws_iam_policy.secrets_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_secrets_attach" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = aws_iam_policy.secrets_policy.arn
}

resource "aws_iam_role_policy_attachment" "ec2_rds_attach" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = aws_iam_policy.rds_policy.arn
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

  # triggers lambda to run when confirming email
  lambda_config {
    post_confirmation = aws_lambda_function.post_confirm.arn
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



# --- Cognito to lambda permission ---
resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirm.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}



# --- RDS ---
resource "aws_db_instance" "db" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t4g.micro"
  multi_az = false

  db_name  = var.db_name
  username = local.db_creds.username
  password = local.db_creds.password

  # no backups
  skip_final_snapshot  = true
  backup_retention_period = 0
  deletion_protection = false

  publicly_accessible = false
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}



# --- Outputs ---
output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "identity_pool_id" {
	value = aws_cognito_identity_pool.main.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "db_endpoint" {
  value = aws_db_instance.db.endpoint
}

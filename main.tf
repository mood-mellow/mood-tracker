terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.47.0"
    }
  }
}

provider "aws" {
  region  = "us-east-2"
  profile = "AdminAccess"
}

variable "db_name" {
  type        = string
  description = "RDS database name"
  default     = "appdb"
  sensitive   = false
}
variable "db_username" {
  type        = string
  description = "RDS username"
  default     = "postgres"
  sensitive   = false
}
variable "db_password" {
  type        = string
  description = "RDS password"
  default     = "password123"
  sensitive   = false
}

# vpc for lambda to RDS
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# subnets
data "aws_availability_zones" "available" {
  state = "available"
}
resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
}
resource "aws_subnet" "subnet_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
}
resource "aws_db_subnet_group" "db_subnets" {
  name       = "rds-subnet-group"
  subnet_ids = [
  	aws_subnet.subnet.id,
   	aws_subnet.subnet_2.id
  ]

  tags = {
    Name = "rds-subnet-group"
  }
}

# security groups
resource "aws_security_group" "lambda_sg" {
  vpc_id = aws_vpc.main.id
}

# RDS security group to allow lambda access
resource "aws_security_group" "rds_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }
}

# RDS
resource "aws_db_instance" "db" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "db.t4g.micro"

  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password

  # no backups
  skip_final_snapshot  = true
  backup_retention_period = 0
  deletion_protection = false

  publicly_accessible = false
  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}

# iam role for lambda
resource "aws_iam_role" "lambda_exec" {
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

# lamda logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Package the Lambda function code
data "archive_file" "lambda_create_user" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda/function.zip"
}

# lambda function
resource "aws_lambda_function" "post_confirm" {
  function_name = "post-confirmation-handler"
  filename      = data.archive_file.lambda_create_user.output_path
  role 			= aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime = "nodejs20.x"

  timeout = 10

  vpc_config {
    subnet_ids         = [aws_subnet.subnet.id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      DB_HOST = aws_db_instance.db.address
      DB_USER = var.db_username
      DB_PASS = var.db_password
      DB_NAME = var.db_name
    }
  }
}

# cognito user pool
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

# cognito to lambda permission
resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirm.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

# user pool client
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

# outputs
output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "identity_pool_id" {
	value = aws_cognito_identity_pool.main.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "db_endpoint" {
  value = aws_db_instance.db.address
}

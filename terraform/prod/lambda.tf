# --- Lambda function ---
# Package the Lambda function code
data "archive_file" "lambda_create_user" {
  type        = "zip"
  source_dir = "${path.module}/../lambda"
  output_path = "${path.module}/../lambda/function.zip"
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
	  aws_subnet.public.id,
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

resource "aws_security_group" "lambda_sg" {
  vpc_id      = aws_vpc.main.id
  description = "Lambda function security group"
}

# --------------------------------------------------
# EC2 Security Group Egress Rules
# --------------------------------------------------

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

# --------------------------------------------------
# EC2 Security Group Egress Rules
# --------------------------------------------------

resource "aws_security_group_rule" "endpoint_ingress_from_lambda" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.vpcendpoint_sg.id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow HTTPS in from Lambda"
}

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


resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = local.azs[1]
}

# --------------------------------------------------
# Public Subnet Setup
# --------------------------------------------------
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = local.azs[0]
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}


# --- VPC endpoint ---
resource "aws_vpc_endpoint" "secretsmanager_vpc_endpoint" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-2.secretsmanager"
  vpc_endpoint_type = "Interface"
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.public.id,
    aws_subnet.subnet_2.id
  ]

  security_group_ids = [aws_security_group.vpcendpoint_sg.id]
}



# --- Security Groups ---
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
  subnet_ids = [aws_subnet.public.id, aws_subnet.subnet_2.id]
}



# --- Security Group Rules ---


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

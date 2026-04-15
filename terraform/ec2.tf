# --- EC2 ---
resource "aws_instance" "docker_ec2" {
  ami           = "ami-0a1b6a02658659c2a"
  instance_type = "t3.nano"

  associate_public_ip_address = true
  subnet_id = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
	#!/bin/bash
	dnf update -y
	dnf install -y docker
	systemctl enable --now docker
	usermod -aG docker ec2-user

	docker pull yingjames/mood-tracker-backend:latest
	docker run -d --name mood-tracker -p 80:8080 yingjames/mood-tracker-backend:latest
    EOF
}

resource "aws_security_group" "ec2_sg" {
	vpc_id = aws_vpc.main.id
	description = "EC2 security group for SSH access"
}

# --------------------------------------------------
# EC2 Security Group Ingress Rules
# --------------------------------------------------

# SSH ingress rule
resource "aws_security_group_rule" "ec2_ssh_ingress" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]  # Allow from anywhere (or restrict to your IP)
  security_group_id = aws_security_group.ec2_sg.id
  description       = "Allow SSH access"
}

# --------------------------------------------------
# EC2 Egress Rules
# --------------------------------------------------

# EC2 egress rule (allow outbound traffic)
resource "aws_security_group_rule" "ec2_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ec2_sg.id
  description       = "Allow all outbound traffic"
}

resource "aws_security_group_rule" "ec2_egress_https" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ec2_sg.id
  description       = "Allow HTTPS outbound for SSM"
}

# IAM Role and Policy Attachment for Spring boot backend
resource "aws_iam_role" "ec2_iam_role" {
	name = "ec2-instance-role"

	assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}



# IAM policy for EC2 Instance Connect
resource "aws_iam_policy" "ec2_instance_connect" {
  name = "ec2-instance-connect-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EC2InstanceConnect"
        Action = [
          "ec2:DescribeInstances",
          "ec2-instance-connect:SendSSHPublicKey"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach the policy to EC2 IAM role
resource "aws_iam_role_policy_attachment" "ec2_instance_connect_attach" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = aws_iam_policy.ec2_instance_connect.arn
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ec2_ssh_attach" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = aws_iam_policy.ec2_instance_connect.arn
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-instance-profile"
  role = aws_iam_role.ec2_iam_role.name
}

variable "db_name" {
  type        = string
  description = "RDS database name"
  default     = "appdb"
  sensitive   = false
}

variable "db_username" {
	type = string
	description = "RDS database username"
	default = "dbuser"
	sensitive = false
}

resource "random_password" "db_password" {
  length  = 16
  special = true
  override_special = "!#$%&*?"
}

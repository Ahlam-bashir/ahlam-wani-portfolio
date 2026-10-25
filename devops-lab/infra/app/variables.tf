variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {

  type    = string
  default = "learnops"
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,19}$", var.project_name))
    error_message = "Use 3–20 lowercase letters, numbers, or hyphens, beginning with a letter."
  }


}

variable "image_uri" {

  type        = string
  description = "Full immutable ECR image reference, e.g. account.dkr.ecr.region.amazonaws.com/learnops:COMMIT_SHA."
  validation {
    condition     = can(regex("^[0-9]{12}\\.dkr\\.ecr\\.[a-z0-9-]+\\.amazonaws\\.com/[^:]+:[a-f0-9]{40}$", var.image_uri))
    error_message = "Use an ECR image tagged with its full 40-character Git commit SHA."
  }


}

variable "commit_sha" {

  type = string
  validation {
    condition     = can(regex("^[a-f0-9]{40}$", var.commit_sha))
    error_message = "commit_sha must be a full 40-character Git commit SHA."
  }


}

variable "allowed_ingress_cidr" {

  type        = string
  description = "Your public IPv4 address with /32. The learning endpoint is intentionally not open to the whole Internet."
  validation {
    condition     = can(cidrhost(var.allowed_ingress_cidr, 0)) && can(regex("/32$", var.allowed_ingress_cidr))
    error_message = "Provide a single public IPv4 address in /32 form."
  }


}


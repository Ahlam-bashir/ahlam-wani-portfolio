terraform {
  required_version = ">= 1.14.6, < 2.0.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}
provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { Project = var.project_name, ManagedBy = "Terraform", Purpose = "Learning" }
  }
}
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
variable "github_repository" {
  type    = string
  default = "Ahlam-bashir/ahlam-wani-portfolio"
}
variable "github_owner_id" {
  type    = string
  default = "68119823"
}
variable "github_repository_id" {
  type    = string
  default = "1432799684"
}
variable "immutable_oidc_subjects" {
  type        = bool
  default     = true
  description = "New GitHub repositories use immutable owner/repository IDs. Set false only if your repository uses the legacy subject format."
}
variable "create_github_oidc_provider" {
  type        = bool
  default     = true
  description = "Set false if the GitHub OIDC provider already exists in this AWS account."
}
data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}
locals {
  account      = data.aws_caller_identity.current.account_id
  partition    = data.aws_partition.current.partition
  owner        = split("/", var.github_repository)[0]
  repository   = split("/", var.github_repository)[1]
  subject      = var.immutable_oidc_subjects ? "repo:${local.owner}@${var.github_owner_id}/${local.repository}@${var.github_repository_id}:environment:devops-lab" : "repo:${var.github_repository}:environment:devops-lab"
  provider_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : "arn:${local.partition}:iam::${local.account}:oidc-provider/token.actions.githubusercontent.com"
}
resource "aws_s3_bucket" "state" {
  bucket        = "${var.project_name}-${local.account}-${var.aws_region}-state"
  force_destroy = false
}
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}
resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id
  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Sid = "DenyInsecureTransport", Effect = "Deny", Principal = "*", Action = "s3:*", Resource = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"], Condition = { Bool = { "aws:SecureTransport" = "false" } } }]
  })
}
resource "aws_ecr_repository" "app" {
  name                 = var.project_name
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false
  image_scanning_configuration { scan_on_push = true }
  encryption_configuration { encryption_type = "AES256" }
}
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name
  policy     = jsonencode({ rules = [{ rulePriority = 1, description = "Keep ten recent lab images", selection = { tagStatus = "any", countType = "imageCountMoreThan", countNumber = 10 }, action = { type = "expire" } }] })
}
resource "aws_iam_openid_connect_provider" "github" {
  count          = var.create_github_oidc_provider ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}
resource "aws_iam_role" "deploy" {
  name                 = "${var.project_name}-github-deploy"
  max_session_duration = 3600
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Principal = { Federated = local.provider_arn }, Action = "sts:AssumeRoleWithWebIdentity", Condition = { StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com", "token.actions.githubusercontent.com:sub" = local.subject } } }]
  })
}
resource "aws_iam_role_policy" "deploy" {
  name = "learnops-delivery"
  role = aws_iam_role.deploy.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Sid = "StateBucket", Effect = "Allow", Action = ["s3:ListBucket", "s3:GetBucketLocation"], Resource = aws_s3_bucket.state.arn },
      { Sid = "StateObjectsAndLock", Effect = "Allow", Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"], Resource = "${aws_s3_bucket.state.arn}/learnops/*" },
      { Sid = "RegistryAuthentication", Effect = "Allow", Action = ["ecr:GetAuthorizationToken"], Resource = "*" },
      { Sid = "ApplicationImages", Effect = "Allow", Action = ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:InitiateLayerUpload", "ecr:UploadLayerPart", "ecr:CompleteLayerUpload", "ecr:PutImage", "ecr:DescribeImages"], Resource = aws_ecr_repository.app.arn },
      { Sid = "RegionalLearningInfrastructure", Effect = "Allow", Action = [
        "ec2:Describe*", "ec2:CreateVpc", "ec2:DeleteVpc", "ec2:ModifyVpcAttribute", "ec2:CreateSubnet", "ec2:DeleteSubnet", "ec2:ModifySubnetAttribute", "ec2:CreateInternetGateway", "ec2:DeleteInternetGateway", "ec2:AttachInternetGateway", "ec2:DetachInternetGateway", "ec2:CreateRouteTable", "ec2:DeleteRouteTable", "ec2:CreateRoute", "ec2:DeleteRoute", "ec2:ReplaceRoute", "ec2:AssociateRouteTable", "ec2:DisassociateRouteTable", "ec2:CreateSecurityGroup", "ec2:DeleteSecurityGroup", "ec2:AuthorizeSecurityGroupIngress", "ec2:RevokeSecurityGroupIngress", "ec2:AuthorizeSecurityGroupEgress", "ec2:RevokeSecurityGroupEgress", "ec2:ModifySecurityGroupRules", "ec2:CreateTags", "ec2:DeleteTags",
        "elasticloadbalancing:Describe*", "elasticloadbalancing:CreateLoadBalancer", "elasticloadbalancing:DeleteLoadBalancer", "elasticloadbalancing:ModifyLoadBalancerAttributes", "elasticloadbalancing:SetSecurityGroups", "elasticloadbalancing:SetSubnets", "elasticloadbalancing:CreateTargetGroup", "elasticloadbalancing:DeleteTargetGroup", "elasticloadbalancing:ModifyTargetGroup", "elasticloadbalancing:ModifyTargetGroupAttributes", "elasticloadbalancing:CreateListener", "elasticloadbalancing:DeleteListener", "elasticloadbalancing:ModifyListener", "elasticloadbalancing:AddTags", "elasticloadbalancing:RemoveTags",
        "ecs:CreateCluster", "ecs:DeleteCluster", "ecs:DescribeClusters", "ecs:DescribeServices", "ecs:DescribeTasks", "ecs:DescribeTaskDefinition", "ecs:RegisterTaskDefinition", "ecs:DeregisterTaskDefinition", "ecs:CreateService", "ecs:UpdateService", "ecs:DeleteService", "ecs:ListTagsForResource", "ecs:TagResource", "ecs:UntagResource",
        "logs:CreateLogGroup", "logs:DeleteLogGroup", "logs:DescribeLogGroups", "logs:PutRetentionPolicy", "logs:DeleteRetentionPolicy", "logs:ListTagsForResource", "logs:TagResource", "logs:UntagResource",
        "cloudwatch:PutMetricAlarm", "cloudwatch:DeleteAlarms", "cloudwatch:DescribeAlarms", "cloudwatch:PutDashboard", "cloudwatch:DeleteDashboards", "cloudwatch:GetDashboard", "cloudwatch:TagResource", "cloudwatch:UntagResource", "cloudwatch:ListTagsForResource"
      ], Resource = "*", Condition = { StringEquals = { "aws:RequestedRegion" = var.aws_region } } },
      { Sid = "ApplicationTaskRoles", Effect = "Allow", Action = ["iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:UpdateAssumeRolePolicy", "iam:ListRolePolicies", "iam:ListAttachedRolePolicies", "iam:ListInstanceProfilesForRole", "iam:TagRole", "iam:UntagRole"], Resource = ["arn:${local.partition}:iam::${local.account}:role/${var.project_name}-execution", "arn:${local.partition}:iam::${local.account}:role/${var.project_name}-task"] },
      { Sid = "ReadExecutionPolicy", Effect = "Allow", Action = ["iam:GetPolicy", "iam:GetPolicyVersion"], Resource = "arn:${local.partition}:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" },
      { Sid = "PassOnlyApplicationRoles", Effect = "Allow", Action = ["iam:PassRole"], Resource = ["arn:${local.partition}:iam::${local.account}:role/${var.project_name}-execution", "arn:${local.partition}:iam::${local.account}:role/${var.project_name}-task"], Condition = { StringEquals = { "iam:PassedToService" = "ecs-tasks.amazonaws.com" } } }
    ]
  })
}
output "state_bucket" { value = aws_s3_bucket.state.bucket }
output "ecr_repository_uri" { value = aws_ecr_repository.app.repository_url }
output "deploy_role_arn" { value = aws_iam_role.deploy.arn }
output "oidc_subject" { value = local.subject }

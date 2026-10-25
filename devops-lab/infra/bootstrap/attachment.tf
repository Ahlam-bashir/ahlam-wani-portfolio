resource "aws_iam_role_policy" "attach_execution_policy" {
  name = "learnops-execution-policy-attachment"
  role = aws_iam_role.deploy.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = ["iam:AttachRolePolicy", "iam:DetachRolePolicy"]
      Resource  = "arn:${local.partition}:iam::${local.account}:role/${var.project_name}-execution"
      Condition = { ArnEquals = { "iam:PolicyARN" = "arn:${local.partition}:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" } }
    }]
  })
}

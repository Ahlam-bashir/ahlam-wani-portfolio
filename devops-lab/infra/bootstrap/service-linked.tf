resource "aws_iam_role_policy" "service_linked_roles" {
  name = "learnops-service-linked-roles"
  role = aws_iam_role.deploy.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["iam:CreateServiceLinkedRole"]
      Resource = [
        "arn:${local.partition}:iam::${local.account}:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
        "arn:${local.partition}:iam::${local.account}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing"
      ]
      Condition = { StringEquals = { "iam:AWSServiceName" = ["ecs.amazonaws.com", "elasticloadbalancing.amazonaws.com"] } }
    }]
  })
}

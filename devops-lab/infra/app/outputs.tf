output "app_url" {
  value = "http://${aws_lb.lab.dns_name}"
}

output "log_group" {
  value = aws_cloudwatch_log_group.app.name
}

output "cluster" {
  value = aws_ecs_cluster.lab.name
}

output "service" {
  value = aws_ecs_service.app.name
}

output "dashboard_url" {
  value = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards/dashboard/${aws_cloudwatch_dashboard.lab.dashboard_name}"
}


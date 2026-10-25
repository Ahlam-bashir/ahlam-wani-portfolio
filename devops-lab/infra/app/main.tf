data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {

}

data "aws_partition" "current" {

}

locals {

  azs            = slice(data.aws_availability_zones.available.names, 0, 2)
  container_name = "learnops"

}

resource "aws_vpc" "lab" {

  cidr_block           = "10.42.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = var.project_name
  }


}

resource "aws_internet_gateway" "lab" {
  vpc_id = aws_vpc.lab.id
}

resource "aws_subnet" "public" {

  count                   = 2
  vpc_id                  = aws_vpc.lab.id
  availability_zone       = local.azs[count.index]
  cidr_block              = cidrsubnet(aws_vpc.lab.cidr_block, 8, count.index)
  map_public_ip_on_launch = false
  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
  }


}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.lab.id
}

resource "aws_route" "internet" {

  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.lab.id

}

resource "aws_route_table_association" "public" {

  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id

}

resource "aws_security_group" "alb" {

  name_prefix = "${var.project_name}-alb-"
  description = "Learning HTTP endpoint restricted to the operator IP"
  vpc_id      = aws_vpc.lab.id

}

resource "aws_security_group" "task" {

  name_prefix = "${var.project_name}-task-"
  description = "Application ingress only from the ALB"
  vpc_id      = aws_vpc.lab.id

}

resource "aws_vpc_security_group_ingress_rule" "http" {

  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = var.allowed_ingress_cidr
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"

}

resource "aws_vpc_security_group_egress_rule" "alb_to_task" {

  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.task.id
  from_port                    = 3000
  to_port                      = 3000
  ip_protocol                  = "tcp"

}

resource "aws_vpc_security_group_ingress_rule" "from_alb" {

  security_group_id            = aws_security_group.task.id
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = 3000
  to_port                      = 3000
  ip_protocol                  = "tcp"

}

resource "aws_vpc_security_group_egress_rule" "https" {

  security_group_id = aws_security_group.task.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"

}

resource "aws_lb" "lab" {

  name                       = var.project_name
  load_balancer_type         = "application"
  internal                   = false
  security_groups            = [aws_security_group.alb.id]
  subnets                    = aws_subnet.public[*].id
  drop_invalid_header_fields = true
  depends_on                 = [aws_internet_gateway.lab, aws_route.internet]

}

resource "aws_lb_target_group" "lab" {

  name                 = var.project_name
  port                 = 3000
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = aws_vpc.lab.id
  deregistration_delay = 15
  health_check {
    path                = "/health/ready"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }


}

resource "aws_lb_listener" "http" {

  load_balancer_arn = aws_lb.lab.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lab.arn
  }


}

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7
}

resource "aws_ecs_cluster" "lab" {
  name = var.project_name
}

resource "aws_iam_role" "execution" {

  name = "${var.project_name}-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17", Statement = [{
      Effect = "Allow", Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }, Action = "sts:AssumeRole"
      }
    ]
    }
  )

}

resource "aws_iam_role_policy_attachment" "execution" {

  role       = aws_iam_role.execution.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

}

resource "aws_iam_role" "task" {

  name               = "${var.project_name}-task"
  assume_role_policy = aws_iam_role.execution.assume_role_policy

}

resource "aws_ecs_task_definition" "app" {

  family                   = var.project_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{

    name                   = local.container_name
    image                  = var.image_uri
    essential              = true
    user                   = "1000"
    readonlyRootFilesystem = true
    portMappings = [{
      containerPort = 3000, protocol = "tcp"
      }
    ]
    environment = [
      {
        name = "APP_ENV", value = "aws-lab"
      },
      {
        name = "COMMIT_SHA", value = var.commit_sha
      },
      {
        name = "ENABLE_DRILLS", value = "false"
      }

    ]
    healthCheck = {
      command = ["CMD", "node", "scripts/healthcheck.mjs"], interval = 15, timeout = 5, retries = 3, startPeriod = 30
    }

    logConfiguration = {
      logDriver = "awslogs", options = {
        "awslogs-group" = aws_cloudwatch_log_group.app.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "app"
      }

    }


    }
  ])

}

resource "aws_ecs_service" "app" {

  name                               = var.project_name
  cluster                            = aws_ecs_cluster.lab.id
  task_definition                    = aws_ecs_task_definition.app.arn
  desired_count                      = 1
  launch_type                        = "FARGATE"
  platform_version                   = "1.4.0"
  health_check_grace_period_seconds  = 60
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  wait_for_steady_state              = true
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.lab.arn
    container_name   = local.container_name
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http, aws_iam_role_policy_attachment.execution, aws_route_table_association.public]
  timeouts {
    create = "15m"
    update = "15m"
    delete = "15m"
  }


}

resource "aws_cloudwatch_metric_alarm" "cpu" {

  alarm_name  = "${var.project_name}-high-cpu"
  namespace   = "AWS/ECS"
  metric_name = "CPUUtilization"
  dimensions = {
    ClusterName = aws_ecs_cluster.lab.name, ServiceName = aws_ecs_service.app.name
  }

  statistic           = "Average"
  period              = 60
  evaluation_periods  = 2
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

}

resource "aws_cloudwatch_metric_alarm" "unhealthy" {

  alarm_name  = "${var.project_name}-unhealthy-target"
  namespace   = "AWS/ApplicationELB"
  metric_name = "UnHealthyHostCount"
  dimensions = {
    LoadBalancer = aws_lb.lab.arn_suffix, TargetGroup = aws_lb_target_group.lab.arn_suffix
  }

  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 2
  threshold           = 0
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

}

resource "aws_cloudwatch_dashboard" "lab" {

  dashboard_name = var.project_name
  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric", x = 0, y = 0, width = 12, height = 6, properties = {
          title = "Service CPU and memory", region = var.aws_region, period = 60, stat = "Average", metrics = [["AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.lab.name, "ServiceName", aws_ecs_service.app.name], ["AWS/ECS", "MemoryUtilization", "ClusterName", aws_ecs_cluster.lab.name, "ServiceName", aws_ecs_service.app.name]]
        }

      },
      {
        type = "metric", x = 12, y = 0, width = 12, height = 6, properties = {
          title = "Unhealthy targets", region = var.aws_region, period = 60, stat = "Maximum", metrics = [["AWS/ApplicationELB", "UnHealthyHostCount", "LoadBalancer", aws_lb.lab.arn_suffix, "TargetGroup", aws_lb_target_group.lab.arn_suffix]]
        }

      }

    ]
    }
  )

}


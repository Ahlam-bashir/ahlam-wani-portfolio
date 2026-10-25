mock_provider "aws" {
  mock_resource "aws_lb" {
    defaults = {
      arn        = "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/learnops/0123456789abcdef"
      arn_suffix = "app/learnops/0123456789abcdef"
      dns_name   = "learnops.example.test"
    }
  }
  mock_resource "aws_lb_target_group" {
    defaults = {
      arn        = "arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/learnops/0123456789abcdef"
      arn_suffix = "targetgroup/learnops/0123456789abcdef"
    }
  }
  mock_resource "aws_lb_listener" {
    defaults = { arn = "arn:aws:elasticloadbalancing:ap-south-1:123456789012:listener/app/learnops/0123456789abcdef/0123456789abcdef" }
  }
  mock_resource "aws_iam_role" {
    defaults = { arn = "arn:aws:iam::123456789012:role/learnops-test-role" }
  }
  mock_resource "aws_ecs_cluster" {
    defaults = {
      id  = "arn:aws:ecs:ap-south-1:123456789012:cluster/learnops"
      arn = "arn:aws:ecs:ap-south-1:123456789012:cluster/learnops"
    }
  }
  mock_resource "aws_ecs_task_definition" {
    defaults = {
      arn      = "arn:aws:ecs:ap-south-1:123456789012:task-definition/learnops:1"
      revision = 1
    }
  }

  mock_data "aws_availability_zones" {
    defaults = {
      names = ["ap-south-1a", "ap-south-1b"]
    }

  }

  mock_data "aws_caller_identity" {
    defaults = {
      account_id = "123456789012"
    }

  }

  mock_data "aws_partition" {
    defaults = {
      partition = "aws"
    }

  }


}

variables {

  image_uri            = "123456789012.dkr.ecr.ap-south-1.amazonaws.com/learnops:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  commit_sha           = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  allowed_ingress_cidr = "203.0.113.10/32"

}

run "container_and_network_guardrails" {

  command = apply
  assert {
    condition     = jsondecode(aws_ecs_task_definition.app.container_definitions)[0].readonlyRootFilesystem
    error_message = "Container filesystem must be read-only."
  }

  assert {
    condition     = jsondecode(aws_ecs_task_definition.app.container_definitions)[0].user == "1000"
    error_message = "Application must run as a non-root UID."
  }

  assert {
    condition     = [for e in jsondecode(aws_ecs_task_definition.app.container_definitions)[0].environment : e.value if e.name == "ENABLE_DRILLS"][0] == "false"
    error_message = "Local drills must be disabled in AWS."
  }

  assert {
    condition     = aws_ecs_service.app.deployment_circuit_breaker[0].enable && aws_ecs_service.app.deployment_circuit_breaker[0].rollback
    error_message = "Failed deployments need a circuit breaker and rollback."
  }

  assert {
    condition     = aws_vpc_security_group_ingress_rule.http.cidr_ipv4 == "203.0.113.10/32"
    error_message = "ALB ingress must be restricted to the operator."
  }

  assert {
    condition     = aws_vpc_security_group_ingress_rule.from_alb.referenced_security_group_id == aws_security_group.alb.id
    error_message = "Task ingress must originate from the ALB security group."
  }

  assert {
    condition     = aws_cloudwatch_log_group.app.retention_in_days == 7
    error_message = "Retain only seven days of lab logs."
  }


}

run "reject_public_ingress" {

  command = plan
  variables {
    allowed_ingress_cidr = "0.0.0.0/0"
  }

  expect_failures = [var.allowed_ingress_cidr]

}

run "reject_mutable_image_tag" {

  command = plan
  variables {
    image_uri = "123456789012.dkr.ecr.ap-south-1.amazonaws.com/learnops:latest"
  }

  expect_failures = [var.image_uri]

}


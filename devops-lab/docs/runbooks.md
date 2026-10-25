# Operations runbook

Commands assume the current directory is `devops-lab/`. AWS examples use the default project name and region; change them if you changed the Terraform inputs.

## Local readiness incident

1. Start the service with `npm run dev` or `docker compose up --build -d`.
2. In Overview, start the readiness drill.
3. Send a test request; expect 503. Poll `/health/live` and `/health/ready`.
4. Find the request's `requestId` in stdout / Compose logs.
5. Restore readiness in the dashboard, then send another probe and expect 200.
6. Fill out the incident template with your real observations.

For Vite development use port 4173 for the UI; the API also listens on localhost:3000.

## ECS deployment fails

- Inspect ECS service deployment events and stopped-task reasons.
- Check that ECR contains the exact image tag and the image targets linux/amd64.
- Check execution-role image pull/log permissions, task outbound HTTPS, routes, and the log group.
- Confirm the process binds `0.0.0.0:3000` and readiness returns 200.
- Inspect ALB target health and the ALB-to-task security group rule.
- An initial deployment cannot automatically roll back if no previous deployment completed. Repair the cause and rerun a reviewed deployment.

```bash
aws ecs describe-services --cluster learnops --services learnops --region ap-south-1
aws logs tail /ecs/learnops --since 10m --region ap-south-1
```

## Manual rollback

Record a working full commit tag before changing anything. In Actions → LearnOps AWS lab (manual), select deploy, set `existing_image_tag` to that previous tag, acknowledge costs, and first leave apply unchecked to review the plan. Run again with apply selected when you choose to deploy it. Verify `/api/status`, task health, and logs.

Do not change the ECS service outside Terraform and assume state will remain consistent. A later apply may revert such changes.

## OIDC access denied

Check the `aud` and exact subject format in the bootstrap output, the environment name `devops-lab`, the selected account, and the main-branch rule. New GitHub repositories can include immutable owner/repository IDs in the subject. If your account/repository uses a legacy subject, set `immutable_oidc_subjects=false` in bootstrap, review the plan, then apply it. Never log an entire OIDC token or paste credentials into an issue.

## A smoke test passes but the ALB URL does not

The workflow checks the container locally. The ALB is restricted to your operator IP, so a hosted GitHub runner is intentionally unable to probe that endpoint. Use the ECS steady-state check and test the output URL from your allowed IP. Update `LEARNOPS_ALLOWED_CIDR` if your IP changed.

## Cleanup

1. Run the manual AWS workflow with operation **destroy**, cost acknowledgement, and apply unchecked. Review the destroy plan.
2. Run it again with apply selected to remove app infrastructure: tasks/service, cluster, ALB/target/listener, network, alarms/dashboard, app IAM roles, and log group. Deleting the log group removes its retained lab logs.
3. Verify the resources are gone in the AWS console. A task count of zero alone does not remove ALB/public IP/other charges.
4. Bootstrap resources deliberately remain: versioned state bucket, ECR images, deployment role, and possibly the GitHub OIDC provider. ECR and S3 can still incur storage costs.
5. To remove bootstrap too, use your original local bootstrap state. Review `terraform -chdir=infra/bootstrap plan -destroy`. The non-empty bucket and repository will block deletion. First deliberately remove only this lab's ECR images and S3 object versions after preserving any state/evidence you need, then apply a reviewed bootstrap destroy plan. Do not delete a GitHub OIDC provider that another project has started using.

Do not delete state first to “clean up.” Losing state can leave billable infrastructure running and unmanaged. Review Billing/Cost Explorer after cleanup; billing data can lag.

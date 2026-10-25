# Optional AWS practice setup

Complete the local exercises first. These instructions are for your own learning AWS account, not your employer/client account. Nothing here has been applied to AWS for you.

## 1. Prerequisites and costs

Install Node.js 24, Docker, AWS CLI v2, and Terraform 1.14.6 or a compatible 1.x version. Use a short-lived AWS sign-in, such as IAM Identity Center / `aws sso login`, with an operator profile allowed to create this lab's IAM, ECR, S3, network, ECS, ALB, and CloudWatch resources. Do not use root or commit access keys. Set up a budget you choose and review current pricing.

The lab has one 0.25-vCPU / 0.5-GB Fargate task, an ALB across two subnets, public IPv4 resources, ECR, S3 state, logs, alarms, and a dashboard. Charges can continue while the app is idle. Cleanup is part of the exercise. The bootstrap intentionally does not grant the GitHub deployment role administrator access; regional creation/describe permissions are still broad enough that you should use a learning account.

```bash
aws sso login --profile YOUR_PROFILE
export AWS_PROFILE=YOUR_PROFILE
aws sts get-caller-identity
```

Use your real profile name; the command does not create a profile. Configure IAM Identity Center access first if you have not done so.

## 2. Bootstrap the registry, state bucket, and GitHub trust

From `devops-lab/`:

```bash
terraform -chdir=infra/bootstrap init
terraform -chdir=infra/bootstrap plan -out=bootstrap.tfplan
# Read the plan. Only run the next command when you choose to create these resources.
terraform -chdir=infra/bootstrap apply bootstrap.tfplan
terraform -chdir=infra/bootstrap output
```

Default region/project: `ap-south-1` / `learnops`. If the account already has the GitHub OIDC provider, pass `-var='create_github_oidc_provider=false'` to the **plan** command. The role will then reference the existing provider instead of recreating it.

Keep `infra/bootstrap/terraform.tfstate` and its backup securely. The bootstrap state is local and ignored by Git. It is required to manage/remove those bootstrap resources later.

The default trust is scoped to **Ahlam-bashir/ahlam-wani-portfolio**, immutable owner ID **68119823**, repository ID **1432799684**, and environment **devops-lab**. Those IDs are public identifiers, not credentials. This repository was created after GitHub introduced immutable OIDC subjects for new repositories. Check the bootstrap's `oidc_subject` output against the subject format your repository uses. For legacy subjects, plan with `-var='immutable_oidc_subjects=false'`. If you move the lab to a different repository, update all repository/owner inputs before applying.

## 3. Configure the GitHub environment

Create a GitHub environment named **devops-lab** and restrict deployment branches to **main**. Add a required reviewer if available for your account/repository and you want a second approval before any manual run. The workflow itself also checks main and never runs automatically on a push.

Add these repository or environment **variables**; none are access-key secrets:

| Variable                | Value                                              |
| ----------------------- | -------------------------------------------------- |
| `LEARNOPS_AWS_REGION`   | `ap-south-1`, or your selected bootstrap region    |
| `LEARNOPS_ROLE_ARN`     | Bootstrap `deploy_role_arn` output                 |
| `LEARNOPS_STATE_BUCKET` | Bootstrap `state_bucket` output                    |
| `LEARNOPS_ECR_URI`      | Bootstrap `ecr_repository_uri` output              |
| `LEARNOPS_ALLOWED_CIDR` | Your current public IPv4 address followed by `/32` |

The workflows assume `project_name=learnops`. If you customize it, also pass `TF_VAR_project_name` to the deployment workflow and update the example CLI resource names. Never paste an AWS access key, password, or OIDC token into a variable, workflow file, log, or issue.

## 4. Review a delivery plan

In GitHub Actions, select **LearnOps AWS lab (manual)** → Run workflow:

- Use branch `main`, operation `deploy`.
- Leave `existing_image_tag` empty to build the current commit.
- Acknowledge AWS costs.
- Leave **apply unchecked** first.

The workflow tests/builds the app, authenticates through OIDC, pushes the immutable commit-tagged image if it does not already exist, and prints an infrastructure plan. Plan-only mode can still incur image storage/API-related costs. It does not create the app infrastructure.

Read the plan in the run log. When you choose to provision it, run again with **apply selected**. That run creates a fresh plan and applies it; this beginner workflow does not promote a previously reviewed binary plan between runs. For stronger production controls, add a separate protected apply job that consumes a reviewed plan.

Terraform waits for ECS steady state. Open the `app_url` output from your allowed IPv4 address, inspect the reported commit, then inspect ECS tasks and CloudWatch logs/dashboard. The hosted Actions runner cannot probe this IP-restricted ALB URL, so the pipeline's HTTP smoke test checks the container locally, not end-to-end AWS connectivity.

## 5. Use Terraform directly, if you prefer

After the workflow has pushed a real image:

```bash
cp infra/app/backend.hcl.example infra/app/backend.hcl
cp infra/app/terraform.tfvars.example infra/app/terraform.tfvars
# Edit BOTH files: real bucket, region, operator IP, image URI, and matching full commit SHA.
terraform -chdir=infra/app init -backend-config=backend.hcl
terraform -chdir=infra/app plan -out=app.tfplan
# Review it; opt in only when ready.
terraform -chdir=infra/app apply app.tfplan
```

The backend uses native S3 locking and bucket versioning. Do not run simultaneous local and workflow applies. If you deliberately change the backend, use Terraform's reinitialization/migration workflow and preserve state.

## 6. Offline infrastructure practice

```bash
terraform -chdir=infra/app init -backend=false
terraform -chdir=infra/app validate
terraform -chdir=infra/app test
```

Provider installation needs an internet connection. Tests use a mocked AWS provider and need no AWS credentials. If you already initialized a real backend in this folder, use a fresh checkout/directory for offline tests so backend configuration does not confuse the exercise.

## 7. Finish with cleanup

Follow **[the cleanup runbook](runbooks.md#cleanup)**. Destroy app infrastructure before considering bootstrap cleanup. ECR images and versioned S3 objects remain after app teardown. Verify Billing/Cost Explorer after the resources are removed.

## Primary references

- [AWS ECS deployment circuit breaker](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html)
- [GitHub OIDC in AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [Terraform S3 backend and state locking](https://developer.hashicorp.com/terraform/language/backend/s3)
- [Terraform mocked providers](https://developer.hashicorp.com/terraform/language/tests/mocking)
- [Official Node Docker image](https://hub.docker.com/_/node)
- [AWS pricing](https://aws.amazon.com/pricing/)

# LearnOps — Release & Reliability Lab

A hands-on DevOps practice project by Ahlam Wani. Start with a React dashboard and a Node.js service, then work through containerization, CI, AWS image delivery, infrastructure as code, monitoring, incident recovery, and cleanup.

This is a learning project. The app's live metrics are real local-process measurements; its AWS delivery diagram is a blueprint until **you** deploy the infrastructure. No AWS deployment is performed merely by pushing this code.

## Start locally

Use Node.js 24 LTS (`nvm use` if you use nvm).

```bash
git clone https://github.com/Ahlam-bashir/ahlam-wani-portfolio.git
cd ahlam-wani-portfolio/devops-lab
npm ci
npm run dev
```

Open **http://localhost:4173**. Both the React dev server and API start together. No AWS account or environment secrets are needed. Use the Overview to send requests, start a readiness failure, inspect 503 responses, and restore service.

```bash
npm test
npm run build
npm start
```

After a production build, `npm start` serves both the UI and API on **http://localhost:3000**. Drills default to disabled in production mode. To practice them in a production process, deliberately set `ENABLE_DRILLS=true`; Compose already enables them for its localhost-only lab.

## Run with Docker

Install Docker Desktop or Docker Engine with Compose, then:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f app
# Open http://localhost:3000
docker compose down
```

## What you can practice

| Area          | Included implementation                                                         | Exercise                                       |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| Git / GitHub  | Standalone project under `devops-lab`; root workflows                           | Branch → pull request → checks                 |
| CI            | API tests, production smoke test, image build, container smoke test, IaC checks | Deliberately fail and repair a check           |
| Docker        | Multi-stage image, non-root runtime, health check, hardened Compose service     | Observe unhealthy vs stopped                   |
| ECR           | Immutable commit tags, scan-on-push, ten-image lifecycle policy                 | Inspect a tag and digest                       |
| ECS / Fargate | ALB routing, task/service, readiness checks, deployment circuit breaker         | Deploy a reviewed change and roll back         |
| CloudWatch    | JSON stdout logs, service dashboard, CPU/target-health alarms                   | Trace a request ID and write an incident note  |
| Terraform     | Bootstrap, S3 state locking, app infrastructure, mock-provider tests            | Review a plan, test guardrails, destroy safely |

Start with **[the seven-session learning path](docs/learning-path.md)**. Then read [architecture](docs/architecture.md), [AWS setup](docs/aws-setup.md), and [operations runbooks](docs/runbooks.md). Use [the incident template](docs/incident-template.md) to build a portfolio of your actual work.

## Repository layout

```text
.github/workflows/learnops-ci.yml       Repository-root CI workflow
.github/workflows/learnops-deploy.yml   Repository-root manual AWS workflow
devops-lab/                            This project
  src/                                React release console and practice path
  server/                             Node HTTP API, health, metrics, JSON logs
  test/                               HTTP integration tests
  scripts/                            Dev launcher, health check, smoke test
  Dockerfile                          Multi-stage application image
  compose.yaml                        Local container lab
  infra/bootstrap/                    State bucket, ECR, GitHub OIDC role
  infra/app/                          Network, ALB, Fargate, logs, alarms
  docs/                               Learning sessions, setup, incidents, cleanup
```

The workflows live at the repository root so GitHub can run them. If moving this project into a separate repository, move those two workflows too and update their `devops-lab` working-directory/cache/trigger prefixes.

## AWS is optional and billable

You can complete the first three sessions without AWS. The AWS lab creates an ALB, Fargate task, public IPv4 resources, ECR storage, S3 state, logs, alarms, and a dashboard. These can incur charges; no free-tier promise is made. There is no NAT Gateway, but this does not make the stack free. Review current [AWS pricing](https://aws.amazon.com/pricing/) and configure your own budget before provisioning.

The workflow is manual, requires cost acknowledgement, and defaults to a plan-only run. It cannot deploy until you configure your own AWS account, bootstrap resources, GitHub environment, and variables. A plan-only deploy can build/push an ECR image. No long-lived AWS keys belong in GitHub secrets or this repository; the workflow uses OIDC.

## Verification

See [VALIDATION.md](VALIDATION.md) for checks actually run and limits. Run CI in your own account and keep the resulting URLs as evidence. A workflow file or passing mock test is not evidence of a real AWS deployment.

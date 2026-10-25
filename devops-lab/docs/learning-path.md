# Seven practical sessions

Start locally. Move to AWS only when you can explain what the next command changes. The dashboard checklist is a manual learning log, not a certification or evidence of a cloud deployment.

| Session           | Practice                                                               | Evidence to keep                                             |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1. Git            | Make a branch, change `APP_VERSION`, run tests, open a PR              | PR URL; explanation of a small, reviewable change            |
| 2. CI             | Break one assertion, push, find the failing Actions step, fix it       | Failed and passing workflow URLs                             |
| 3. Containers     | Build/run Compose, inspect UID, health, logs, restart behavior         | Terminal output; explanation of build stage vs runtime stage |
| 4. Registry       | Bootstrap AWS deliberately, push a commit-tagged ECR image             | Tag and digest; explain immutable tags                       |
| 5. Delivery       | Review Terraform, opt into ECS deployment, inspect task health         | Plan, task revision, matching commit in `/api/status`        |
| 6. Operations     | Trace a request ID through structured logs; inspect metrics            | Your completed incident report                               |
| 7. Infrastructure | Run mock tests, change a resource in a branch, review drift, tear down | Test output, plan review, cleanup verification               |

## First 30 minutes

1. Run `npm ci` and `npm run dev`. Open `http://localhost:4173`.
2. Send three test requests. Explain which counter changed and why polling does not increase it.
3. Start the readiness drill. Send another request and inspect its HTTP status.
4. Compare `/health/live` and `/health/ready`. Explain why the process is alive but cannot accept work.
5. Restore readiness. Capture the recovery event and the request ID in server stdout.
6. Open Practice path and mark only the exercise you actually completed.

## Container session

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f app
```

Open `http://localhost:3000`. Start the drill and inspect `docker compose ps` after health-check retries. Compose marks the container unhealthy; it does not restart it solely because of that status. Restore readiness and verify healthy status again. Metrics and events are in process memory, so recreating the container resets them. Your practice checklist stays in that browser's local storage.

```bash
docker compose exec app id
docker compose exec app node scripts/healthcheck.mjs
docker compose down
```

## Stretch exercises

- Add a latency drill behind the existing local-only switch and test its recovery.
- Add an integration test for SIGTERM draining, including one in-flight slow request.
- Create a CloudWatch alarm with an SNS notification subscription you explicitly approve.
- Add HTTPS with your own domain and ACM certificate; do not submit credentials over the lab's HTTP endpoint.
- Split the GitHub deployment role into plan and apply roles, then introduce protected deployment approvals.
- Pin the Docker base image by digest and add automated dependency updates.
- Add persistent data through a managed database and explain migrations, backups, and costs before provisioning it.

## Talk about the project honestly

Before AWS practice: “Built a React/Node DevOps learning lab with Docker, automated tests, GitHub Actions, and Terraform configuration for ECS. Practicing AWS delivery and operations.”

After you personally deploy and verify it: describe the exact region, image, workflow, monitoring, incident, and cleanup you performed. Do not claim production operations, uptime percentages, cost savings, or certification from this lab alone.

# Validation record

These are implementation checks, not a claim of production experience or an AWS deployment.

## Checked locally

- Node.js 24 dependency installation and React/Vite production build.
- Six HTTP integration tests: readiness failure/recovery, liveness independence, safe drill defaults, cross-origin rejection, development proxy origin support, invalid/oversized request handling, static response headers, path traversal rejection, and shutdown metadata/readiness behavior.
- GitHub Actions workflow syntax with actionlint.
- Terraform formatting and provider dependency installation with signed HashiCorp provider packages.

## Environment limits and cloud status

Docker Engine is not installed in the authoring environment. Terraform's AWS provider cannot open its local plugin socket in this environment (`operation not permitted`). Provider schema validation and mock-provider tests therefore require the included GitHub CI runner or your local machine. The CI workflow includes Docker build/runtime smoke checks and Terraform validate/mock tests.

No AWS resources were created. No AWS deploy/destroy workflow was triggered during authoring. The AWS path still needs your own account setup, a real reviewed plan, an explicit deployment, endpoint verification from your allowed IP, and cleanup.

Browser checks and remote CI results are recorded after their runs complete below.

## Browser checks

Desktop, 390px mobile, and 768px tablet layouts were inspected. Mobile/tablet documents had no horizontal overflow. The browser exercise verified a successful probe, readiness failure, a 503 probe, and recovery. All seven learning sessions and three incident runbooks opened correctly. A manually marked learning step persisted across a page reload.

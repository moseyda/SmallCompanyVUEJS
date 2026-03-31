# Backend GitHub PR Integration

This demo backend can create a real GitHub Pull Request when configured with environment variables. If not configured (or if the GitHub request fails), the server falls back to generating a demo PR URL.

Environment variables:

- `GITHUB_TOKEN` — a personal access token with `repo` scope (used to create branches and PRs).
- `GITHUB_OWNER` — the GitHub repository owner (e.g. `your-org` or `your-username`).
- `GITHUB_REPO` — the GitHub repository name (e.g. `my-repo`).
- `GITHUB_BASE_BRANCH` — the base branch to branch from (default: `main`).

Example (set env vars and run):

```bash
# Example (bash)
export GITHUB_TOKEN="ghp_xxx..."
export GITHUB_OWNER="your-org"
export GITHUB_REPO="your-repo"
export GITHUB_BASE_BRANCH="main"
node backend/index.js
```

Manual test (create PR for vulnerability `vuln-1`):

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{ "platform": "github", "branchName": "fix-vuln-vuln-1-test", "title": "Fix vuln-1 (demo)", "body": "This is a test PR created by the demo backend." }' \
  http://localhost:8787/api/vulnerabilities/vuln-1/remediation/merge-request
```

If configured correctly, the response will contain the created PR object with `url` pointing to GitHub. If the creation fails, the endpoint returns a demo/stub URL instead.

GitHub App (recommended for SaaS)
--------------------------------

This backend also supports creating PRs as a GitHub App. The App approach is recommended for a multi-tenant SaaS because it provides a one-time install per organization and short-lived installation tokens for server-side automation.

Required environment variables for GitHub App mode:

- `GITHUB_APP_ID` — the numeric GitHub App ID.
- `GITHUB_APP_PRIVATE_KEY` — the PEM private key for the App (multi-line). Alternatively set `GITHUB_APP_PRIVATE_KEY_PATH` to point to a file containing the private key.
- Optionally `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BASE_BRANCH` will be used as defaults when not provided in requests.

How to use (high level):
1. Create a GitHub App on GitHub.com (Settings → Developer settings → GitHub Apps).
2. Upload the private key and note the App ID.
3. Install the App into target repositories or organizations.
4. Provide the App ID and private key to this backend (via env vars or secrets manager) and restart the server.

Helpful admin endpoints (authenticated):
- `GET /api/github/app/installations` — list installations for the configured App.
- `POST /api/github/app/installations/:installationId/token` — create (and cache) an installation access token for the given installation.

Create PR with App (example):

```bash
# set env vars (in shell)
export GITHUB_APP_ID="123456"
export GITHUB_APP_PRIVATE_KEY_PATH="/path/to/private-key.pem"
node backend/index.js

# create PR via remediation endpoint using installationId and owner/repo
curl -X POST -H "Content-Type: application/json" \
  -d '{"installationId":12345, "owner":"your-org","repo":"your-repo","branchName":"feature/auto-fix","title":"Fix vuln","body":"Automated PR"}' \
  http://localhost:8787/api/vulnerabilities/vuln-001/remediation/merge-request
```

Security notes:
- Store the private key securely (do not commit it to source).
- Use short-lived installation tokens (this server caches them until expiry).
- Prefer GitHub App over per-user PATs for automation and scalability.

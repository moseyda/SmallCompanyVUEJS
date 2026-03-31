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

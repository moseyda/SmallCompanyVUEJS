# INSTRUCTIONS — Settings, Admin Integrations, and Merge Request Flows

This document describes how to configure and use the new GitHub App / Merge Request flows, including where settings and mappings live, how to add repository mappings in the Admin UI, and how to create / auto-create merge requests from the Remediation workflow.

**Quick links**
- Admin Integrations UI: [workspace-app/src/views/AdminIntegrations.vue](workspace-app/src/views/AdminIntegrations.vue)
- Settings store: [workspace-app/src/stores/settings.js](workspace-app/src/stores/settings.js)
- Remediation workflow UI: [workspace-app/src/components/RemediationWorkflow.vue](workspace-app/src/components/RemediationWorkflow.vue)
- MR creation logic: [workspace-app/src/stores/vulnerabilities.js](workspace-app/src/stores/vulnerabilities.js)
- Backend MR / App helpers: [backend/index.js](backend/index.js)

---

**Overview**
- The app supports two GitHub flows:
  - Personal Access Token (PAT) — legacy/demo flow using `GITHUB_TOKEN`.
  - GitHub App — recommended SaaS flow: one-time app install, server-managed installation tokens.
- Admins can register per-repo mappings (installationId → owner/repo/baseBranch). Remediation workflows allow selecting a mapping per vulnerability; the mapping is persisted and used by the backend when creating branches / PRs.

**Prerequisites**
- Node installed. From the repo root:

  ```bash
  # backend
  cd backend
  # set environment variables (examples)
  export GITHUB_OWNER="your-org"
  export GITHUB_REPO="your-repo"
  export GITHUB_BASE_BRANCH="main"

  # For PAT flow (optional)
  export GITHUB_TOKEN="ghp_xxx..."

  # For GitHub App flow (recommended)
  export GITHUB_APP_ID="123456"
  # provide either the private key (multi-line) or a path to it
  export GITHUB_APP_PRIVATE_KEY_PATH="/path/to/private-key.pem"

  node index.js

  # frontend
  cd ../workspace-app
  npm install
  npm run dev
  ```

- Backend env vars used by the demo server (see [backend/index.js](backend/index.js)):
  - `GITHUB_TOKEN` — PAT (fallback/demo)
  - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BASE_BRANCH` — repo defaults
  - `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` or `GITHUB_APP_PRIVATE_KEY_PATH` — GitHub App credentials
  - Optional token refresh timing: `GITHUB_APP_TOKEN_REFRESH_INTERVAL_MS`, `GITHUB_APP_TOKEN_REFRESH_BEFORE_EXPIRY_MS`.

**Admin — add GitHub App repository mappings**
- Who: users with `settings:write` permission.
- Where: Admin → Integrations (route `/admin/integrations`). See [workspace-app/src/views/AdminIntegrations.vue](workspace-app/src/views/AdminIntegrations.vue).
- Purpose: register one or more repository mappings so remediation can pick the correct installation/owner/repo when creating PRs.

Steps:
- Open Admin → Integrations.
- Click the button to fetch installations (this calls the backend `GET /api/github/app/installations`).
- Choose an installation; fill `owner`, `repo`, and `baseBranch` (default `main`).
- Save — this persists mappings to settings (via `settings.updateGithubAppMappings`) and the mappings become available in the Remediation UI.

Expected result:
- The mapping will appear in the Admin list and be saved to the workspace settings store (`profile.githubAppMappings`).

**Settings & Onboarding**
- The Settings page contains a GitHub App onboarding area and defaults. See [workspace-app/src/components/GitHubAppOnboarding.vue](workspace-app/src/components/GitHubAppOnboarding.vue) and [workspace-app/src/views/Setting.vue](workspace-app/src/views/Setting.vue).
- To use the GitHub App flow you must create a GitHub App in your GitHub org/user, generate the private key, and note the App ID.
- Set `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` (or provide a path) on the backend and restart the backend.
- The Admin UI will list App installations (accounts/orgs that installed the App), and you can create mappings from those installations.

**Remediation → Merge Request Integration (developer flow)**
Reference: [workspace-app/src/components/RemediationWorkflow.vue](workspace-app/src/components/RemediationWorkflow.vue)

1. Open Vulnerabilities → click a vulnerability → switch to the "Remediation" panel.
2. Repository Mapping:
   - If you have saved mappings they appear in the dropdown (owner/repo (inst <id>)).
   - If none exist, you will see a muted hint with a link to Admin → Integrations.
3. Select mapping or choose Manual / None.
   - Selecting a mapping persists it to the remediation object via `vulnStore.updateRemediation`.
4. Branch name: provide or use the default `feature/fix-vulnerability`.
5. Auto-Create PR:
   - Toggle this to enable the store's auto-create flow.
   - When `Auto-Create PR` is `true` and remediation `status` transitions to `in-progress`, the store attempts to create a PR automatically (see [workspace-app/src/stores/vulnerabilities.js](workspace-app/src/stores/vulnerabilities.js)).
6. Create Merge Request (manual): click the button to create PR immediately.

Expected UI result after MR creation:
- Success message: "Merge request created successfully." (temporary)
- The PR appears in the "Created Merge Requests" list with a link to the PR.
- The remediation status will reflect progress; store maintains `remediation.pullRequests`.

**What the frontend sends to the backend**
- MR creation payload includes branchName, fixId, platform and, when a mapping is selected, the mapping fields:
  - `installationId`, `owner`, `repo`, `baseBranch`, and `platform`.
- Backend uses `installationId` + GitHub App credentials to create an installation token and call GitHub APIs to create refs and PRs.
- If `installationId` is not provided and `GITHUB_TOKEN` is set, backend falls back to PAT flow (less preferred).

**Auto-Create PR behavior**
- Trigger: `updateRemediation` sets `mergeRequestIntegration.autoCreate = true` and remediation status becomes `in-progress`.
- Action: The vulnerabilities store checks for `autoCreate` + `status === 'in-progress'` and calls `createMergeRequest` if no PR exists yet.
- Expected result: new PR created and added to remediation.pullRequests.

**Troubleshooting**
- Permission Denied when visiting Admin route:
  - Message: "You do not have permission to access that page." The router will redirect to `/dashboard` and show a browser alert.
  - Fix: Ensure the authenticated user's permissions include `settings:write`. Check the auth session (`localStorage` key `auth_user`).
- No mappings in dropdown:
  - Visit Admin → Integrations and add mappings.
- Merge request creation fails:
  - Check backend logs for the error message.
  - Common causes:
    - App installation does not have repository permissions.
    - Wrong `owner`/`repo` or `baseBranch` mismatch.
    - Missing backend env vars (`GITHUB_APP_ID`/private key) for App flow or missing `GITHUB_TOKEN` for PAT fallback.
- If server falls back to PAT flow unexpectedly, confirm `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` are configured and readable by the backend.

**Developer / Test checklist (quick)**
1. Start backend with App credentials or PAT:
   - `export GITHUB_APP_ID=...; export GITHUB_APP_PRIVATE_KEY_PATH=/path/key.pem` OR `export GITHUB_TOKEN=ghp_xxx...`
   - `node backend/index.js`
2. Start frontend:
   - `cd workspace-app && npm run dev`
3. Login as an admin user (must have `settings:write`).
4. Admin → Integrations: fetch installations and add one mapping for your repo.
5. Open a vulnerability, choose the mapping, set Auto-Create PR (or click Create Merge Request manually), then Start Remediation (to trigger the auto flow).
6. Verify a PR appears in the Created Merge Requests list and on GitHub.

**Key files to review**
- Backend: [backend/index.js](backend/index.js)
- Frontend:
  - Settings store: [workspace-app/src/stores/settings.js](workspace-app/src/stores/settings.js)
  - Vulnerabilities store (MR creation): [workspace-app/src/stores/vulnerabilities.js](workspace-app/src/stores/vulnerabilities.js)
  - Remediation UI: [workspace-app/src/components/RemediationWorkflow.vue](workspace-app/src/components/RemediationWorkflow.vue)
  - Admin Integrations view: [workspace-app/src/views/AdminIntegrations.vue](workspace-app/src/views/AdminIntegrations.vue)

---

If you want, I can:
- Add a non-blocking toast component to replace `window.alert` for permission-denied feedback.
- Walk through a recorded smoke test (I can run the app locally here and simulate the flow and report results).


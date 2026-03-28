# SmallCompanyVUEJS Repository

This repository is structured as a small monorepo with separate frontend and backend folders:

- `workspace-app/`: Vue 3 + Vite frontend application.
- `backend/`: Express API service.

## Quick Start

From the repository root:

```bash
npm install
npm install --prefix backend
npm install --prefix workspace-app
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:8787`

## Scripts (Repository Root)

- `npm run dev`: Run backend and frontend together.
- `npm run dev:backend`: Run backend only.
- `npm run dev:frontend`: Run frontend only.
- `npm run test`: Run backend and frontend tests.
- `npm run build`: Build frontend assets.

## Notes

- Backend and frontend are intentionally separated so architecture and deployment can evolve independently.
- Settings access is now guarded behind sign-in via the shared auth foundation.
- Backend now enforces authentication on settings API routes.
- Roles are now enforced for settings updates: `admin` and `editor` can edit, `viewer` is read-only.
- Feature, fix, and documentation changes should be committed as separate units.

## Demo Users

- `lead@smallcompany.io` / `Passw0rd!` (`admin`)
- `editor@smallcompany.io` / `Passw0rd!` (`editor`)
- `viewer@smallcompany.io` / `Passw0rd!` (`viewer`)

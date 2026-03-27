# SmallCompanyVUEJS Repository

This repository currently contains two app folders:

- `workspace-app/`: Primary and current application workspace (actively maintained).
- `sidebar/`: Legacy/parallel folder kept intentionally for compatibility and reference.

## Recommended App

Use `workspace-app/` for all active development.

## Quick Start (workspace-app)

```bash
cd workspace-app
npm install
npm run dev:full
```

Frontend: `http://localhost:5173`

API: `http://localhost:8787`

## Useful Scripts

From inside `workspace-app/`:

- `npm run dev`: Start Vite frontend.
- `npm run api`: Start local Express API.
- `npm run dev:full`: Run frontend + API together.
- `npm test`: Run test suite.
- `npm run build`: Create production build.

## Notes

- The repository keeps both folders by request.
- New features and fixes should target `workspace-app/` unless explicitly stated otherwise.

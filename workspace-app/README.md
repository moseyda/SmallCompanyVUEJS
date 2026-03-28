# SmallCompany Workspace

Modern Vue 3 workspace app with a separate Express backend, Pinia state management, and Vitest test coverage.

## Overview

This project includes:

- A modern multi-page Vue application powered by Vite.
- A separate backend API for workspace data, settings sync, and enquiry submission.
- Route-level authentication with sign-in flow and guarded pages.
- Centralized frontend state with Pinia for cross-page consistency.
- Component-level and route smoke tests using Vitest.

## Tech Stack

- Vue 3
- Vue Router
- Pinia
- Vite
- Vitest + Vue Test Utils

## Getting Started

### 1) Install dependencies

```bash
cd ..
npm install
npm install --prefix backend
npm install --prefix workspace-app
```

### 2) Run frontend only

```bash
cd workspace-app
npm install
npm run dev
```

### 3) Run backend API only

```bash
cd ../backend
npm run dev
```

### 4) Run frontend + backend together

```bash
cd ..
npm run dev
```

Frontend runs on `http://localhost:5173`.

API runs on `http://localhost:8787`.

## Scripts

From repository root:

- `npm run dev`: Start both frontend and backend.
- `npm run dev:frontend`: Start frontend only.
- `npm run dev:backend`: Start backend only.

From `workspace-app/`:

- `npm run dev`: Start Vite dev server.
- `npm run build`: Build production assets.
- `npm run preview`: Preview production build.
- `npm test`: Run tests once.
- `npm run test:watch`: Run tests in watch mode.

## API Endpoints

- `GET /api/overview`
- `GET /api/projects`
- `GET /api/services`
- `GET /api/insights`
- `GET /api/milestones`
- `GET /api/team-members`
- `GET /api/offices`
- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/inquiries`

## Demo Sign-In

- Email: `lead@smallcompany.io`
- Password: `Passw0rd!`

## Project Structure

```text
backend/              # Express API
workspace-app/        # Frontend app
	src/
		api/              # Frontend API client
		stores/           # Pinia stores
		views/            # Route views
		components/       # Reusable UI components
		router/           # App routes
		tests/            # Vitest setup
```

## Testing

Run the full test suite:

```bash
npm test
```

Current coverage includes:

- Route smoke tests for expanded routes.
- Component tests for API-backed views.

## Notes

- Settings are synchronized through the API and managed in Pinia.
- This repository currently uses in-memory API data (no database yet).

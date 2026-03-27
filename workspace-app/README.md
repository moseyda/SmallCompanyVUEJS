# SmallCompany Workspace

Modern Vue 3 workspace app with a local Express API, Pinia state management, and Vitest test coverage.

## Overview

This project includes:

- A modern multi-page Vue application powered by Vite.
- A local backend API for workspace data, settings sync, and inquiry submission.
- Centralized frontend state with Pinia for cross-page consistency.
- Component-level and route smoke tests using Vitest.

## Tech Stack

- Vue 3
- Vue Router
- Pinia
- Vite
- Express
- Vitest + Vue Test Utils

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run frontend only

```bash
npm run dev
```

### 3) Run backend API only

```bash
npm run api
```

### 4) Run frontend + backend together

```bash
npm run dev:full
```

Frontend runs on `http://localhost:5173`.

API runs on `http://localhost:8787`.

## Scripts

- `npm run dev`: Start Vite dev server.
- `npm run api`: Start local Express API.
- `npm run dev:full`: Start both frontend and backend.
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
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/inquiries`

## Project Structure

```text
workspace-app/
	server/             # Local Express API
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

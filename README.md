# Task Manager (Full Stack)

A full-stack Task Manager app with JWT authentication, profile management, and a React dashboard UI.

## Tech Stack

- Frontend: React, Vite, Zustand, Tailwind CSS, shadcn/ui, Axios
- Backend: Node.js, Express, JWT, Swagger
- Data: In-memory store (seeded demo data)

## Project Structure

````text

 - `DELETE /api/profiles/:id`  - `PUT /api/profiles/:id`  - `POST /api/profiles`  - `GET /api/profiles`- Profiles (protected)  - `POST /api/auth/logout`  - `POST /api/auth/refresh`  - `POST /api/auth/login`  - `POST /api/auth/register`- Auth## API Routes (High Level)```npm run install:all```bash4. Clear and reinstall dependencies:```lsof -i :5001```bash3. Port conflict check (macOS/Linux):- Keep backend `PORT=5001` in `backend/.env`.- Frontend proxy points to `http://localhost:5001`.

 2. Frontend cannot reach API:- Confirm no other process is using the backend port.- Confirm `backend/.env` exists and includes valid JWT secrets.1. Backend fails to start:## Troubleshooting- Access and refresh token flow is handled in the frontend Axios interceptors.  - Password: `demo1234`  - Email: `demo@example.com`- Backend seeds demo credentials on startup:## Authentication Notes- `npm run preview` - preview production build- `npm run build` - production build- `npm run dev` - start Vite dev serverFrom `frontend/`:- `npm start` - start backend with node- `npm run dev` - start backend with nodemonFrom `backend/`:- `npm run dev:frontend` - run frontend Vite dev server- `npm run dev:backend` - run backend in watch mode- `npm run dev` - run backend and frontend together with concurrently- `npm run install:all` - install backend and frontend dependenciesFrom repository root:## Available Scripts```npm --prefix frontend run build```bash## Build Frontend```npm run dev:frontend```bashFrontend only:```npm run dev:backend```bashBackend only:## Run Services Separately- Swagger docs: http://localhost:5001/api-docs- API health: http://localhost:5001/api/health- Frontend: http://localhost:30004. Open the app```npm run dev```bash3. Start frontend + backend together```NODE_ENV=developmentREFRESH_TOKEN_SECRET=your_refresh_secretACCESS_TOKEN_SECRET=your_access_secretPORT=5001```env2. Verify backend environment file exists at `backend/.env` with:```npm run install:all```bash1. Install all dependencies## Quick Setup- npm 9+- Node.js 18+## Prerequisites```  package.json    src/  frontend/    src/    .env    server.js  backend/task-manager/
````

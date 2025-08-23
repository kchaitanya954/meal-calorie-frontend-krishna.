# Frontend (Next.js) - Meal Calorie App

## Setup
1) Env
```bash
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API_BASE_URL to your backend (local: http://localhost:8000)
```
2) Install & run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Docker (Dev)
From repo root:
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Postgres: localhost:5432 (user/pass: postgres/postgres)

## Decisions / Trade-offs
- Next.js App Router with simple client components for clarity; no RSC data fetching to keep code approachable.
- next-themes for dark/light; Provider is wrapped at layout.
- Zustand for auth/meal state with localStorage persistence; hydration flag avoids false redirects on refresh.
- API base URL via env and docker-compose; for Vercel, set `NEXT_PUBLIC_API_BASE_URL` in project settings.
- Simple forms with minimal styling to prioritize functionality over UI complexity.

## Pages
- /register, /login
- /dashboard (guarded)
- /calories (lookup)
- /meals (list/create/delete)

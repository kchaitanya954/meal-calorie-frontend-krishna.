# Meal Calorie Count Generator (FastAPI + Next.js)

A full-stack app to register/login, look up calories/macros from USDA FoodData Central, and log meals.

## Hosted link
- Vercel: https://meal-calorie-frontend-krishna.vercel.app/

## Tech
- Backend: Python, FastAPI, SQLAlchemy, Postgres, JWT (python-jose), httpx
- Frontend: Next.js (App Router, TS), Tailwind, Zustand, next-themes

## Setup (Local with Docker)
1) Backend + DB
```bash
cd backend
cp .env.example .env
docker compose -f docker-compose.backend.yml up --build
# API → http://localhost:8000
```

Create `backend/.env` (required):
- `SECRET_KEY` = long random string
- `DATABASE_URL` = postgresql+psycopg2://postgres:postgres@db:5432/meal_calories
- `USDA_API_KEY` = your USDA key
- Optional (defaults): `JWT_ALGORITHM` (HS256), `ACCESS_TOKEN_EXPIRE_MINUTES` (60), `RATE_LIMIT` (15/minute), `USDA_CACHE_TTL_SECONDS` (300), `USDA_API_BASE_URL` (USDA search URL)

2) Frontend
```bash
cd frontend
cp .env.local.example .env.local
docker compose -f docker-compose.frontend.yml up --build
# Web → http://localhost:3000
```
Alternatively set `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Endpoints (Backend)
- POST `/auth/register`
  - Request (JSON):
    ```json
    { "first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "StrongPass123" }
    ```
  - Response (JSON):
    ```json
    { "id": 1, "first_name": "John", "last_name": "Doe", "email": "john@example.com" }
    ```

- POST `/auth/login`
  - Request (x-www-form-urlencoded):
    ```
    username=john@example.com&password=StrongPass123
    ```
  - Response (JSON):
    ```json
    { "access_token": "<jwt>", "token_type": "bearer" }
    ```

- POST `/get-calories` (JWT)
  - Request (JSON):
    ```json
    { "dish_name": "Cheddar Cheese", "servings": 2 }
    ```
  - Response (JSON):
    ```json
    {
      "dish_name": "Cheddar Cheese",
      "matched_name": "CHEDDAR CHEESE",
      "fdc_id": 2057648,
      "servings": 2,
      "calories_per_serving": 110.0,
      "total_calories": 220.0,
      "source": "USDA FoodData Central",
      "ingredients_text": "...",
      "macros_per_serving": { "protein_g": 21.4, "fat_g": 28.6, "carbs_g": 3.57 },
      "suggestions": ["CHEDDAR CHEESE", "CRYSTAL FARMS CHEDDAR CHEESE", "..."]
    }
    ```

- POST `/meals` (JWT)
  - Request (JSON):
    ```json
    { "dish_name": "Cheddar Cheese", "servings": 2 }
    ```
  - Response (JSON):
    ```json
    {
      "id": 10,
      "dish_name": "Cheddar Cheese",
      "matched_name": "CHEDDAR CHEESE",
      "fdc_id": 2057648,
      "servings": 2,
      "calories_per_serving": 110.0,
      "total_calories": 220.0,
      "protein_g": 21.4,
      "fat_g": 28.6,
      "carbs_g": 3.57,
      "ingredients_text": "..."
    }
    ```

- GET `/meals` (JWT)
  - Response (JSON): 
  ```json
    {
      "id": 10,
      "dish_name": "Cheddar Cheese",
      "matched_name": "CHEDDAR CHEESE",
      "fdc_id": 2057648,
      "servings": 2,
      "calories_per_serving": 110.0,
      "total_calories": 220.0,
      "protein_g": 21.4,
      "fat_g": 28.6,
      "carbs_g": 3.57,
      "ingredients_text": "..."
    }
    ```

- DELETE `/meals/{id}` (JWT)
  - Response: 204

## Frontend Pages
- `/register`, `/login`
- `/dashboard` (guarded)
- `/calories` – search + result card (save meal)
- `/meals` – list/create/delete meals

## Decisions / Trade-offs
- Fuzzy matching with RapidFuzz; also show USDA top suggestions and the matched item.
- Calories per serving prefers `labelNutrients.calories`, else energy (1008) scaled by serving grams when needed.
- Simple in-memory cache for USDA responses to reduce API calls.
- Rate limiting via slowapi on key endpoints.
- Client-side routing and state (Zustand) for simplicity; avoids complex SSR data loading.
- Theme default set to light; user can toggle in header.

## Screenshots

<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.44.17 AM.png" alt="Screenshot 1" width="600"/><br>
  <em>[Registration page]</em>
</p>
<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.44.32 AM.png" alt="Screenshot 2" width="600"/><br>
  <em>[login page]</em>
</p>
<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.44.38 AM.png" alt="Screenshot 3" width="600"/><br>
  <em>[main dashboard]</em>
</p>
<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.44.53 AM.png" alt="Screenshot 4" width="600"/><br>
  <em>[calories counter]</em>
</p>
<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.45.06 AM.png" alt="Screenshot 5" width="600"/><br>
  <em>[meals logger]</em>
</p>
<p align="center">
  <img src="test_images/Screenshot 2025-08-24 at 1.45.39 AM.png" alt="Screenshot 6" width="600"/><br>
  <em>[changing color mode]</em>
</p>
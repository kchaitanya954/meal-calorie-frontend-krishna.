# Meal Calorie Backend (FastAPI)

## Tech
- FastAPI, Uvicorn
- PostgreSQL + SQLAlchemy
- JWT Auth (python-jose), Password hashing (passlib[bcrypt])
- USDA FoodData Central (httpx)
- Rate limiting (slowapi)

## Structure
```
backend/
  app/
    main.py
    core/
      config.py
      security.py
      rate_limiter.py
      cache.py
    db/
      database.py
      models.py
      init_db.py
    schemas/
      auth.py
      calories.py
    api/
      deps.py
      routes/
        auth.py
        calories.py
    services/
      usda_service.py
    utils/
      errors.py
      logger.py
    tests/
      test_auth.py
      test_calories.py
  requirements.txt
  docker-compose.yml
  README.md
```

## Setup
1) Create .env (example values)
```
ENV=development
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=change-this-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_ALGORITHM=HS256
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/meal_calories
USDA_API_KEY=<your-usda-key>
USDA_API_BASE_URL=https://api.nal.usda.gov/fdc/v1/foods/search
RATE_LIMIT=15/minute
USDA_CACHE_TTL_SECONDS=300
```

2) Start Postgres (optional)
```bash
docker compose up -d
```

3) Install & run
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

4) Docs: http://localhost:8000/docs

## Endpoints
- POST `/auth/register`
- POST `/auth/login` (OAuth2 password flow)
- POST `/get-calories` { dish_name, servings }

## Notes
- Set `USDA_API_KEY` in `.env`.
- `DATABASE_URL` must point to your Postgres.
- Rate limit defaults to `15/minute`.


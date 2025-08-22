from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.rate_limiter import limiter
from app.db.init_db import init_db
from app.api.routes.auth import router as auth_router
from app.api.routes.calories import router as calories_router
from app.api.routes.meals import router as meals_router
from app.utils.errors import add_exception_handlers


def create_app() -> FastAPI:
    application = FastAPI(title="Meal Calorie Backend", version="1.0.0")

    # CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rate limiting
    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Routers
    application.include_router(auth_router, prefix="/auth", tags=["auth"])
    application.include_router(calories_router, tags=["calories"])
    application.include_router(meals_router, tags=["meals"])

    # Exceptions
    add_exception_handlers(application)

    @application.on_event("startup")
    def on_startup() -> None:
        init_db()

    @application.get("/health")
    def health() -> dict:
        return {"status": "ok", "env": settings.ENV}

    return application


app = create_app()


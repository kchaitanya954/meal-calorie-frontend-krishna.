from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = Field("development")
    API_HOST: str = Field("0.0.0.0")
    API_PORT: int = Field(8000)

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60)
    JWT_ALGORITHM: str = Field("HS256")

    DATABASE_URL: str

    USDA_API_KEY: str
    USDA_API_BASE_URL: str = Field("https://api.nal.usda.gov/fdc/v1/foods/search")

    RATE_LIMIT: str = Field("15/minute")
    USDA_CACHE_TTL_SECONDS: int = Field(300)


settings = Settings()


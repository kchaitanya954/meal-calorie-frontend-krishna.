from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MealLogCreate(BaseModel):
    dish_name: str = Field(min_length=0, max_length=100)
    servings: int = Field(gt=0, le=100)
    note: Optional[str] = None

    @field_validator("dish_name", mode="before")
    @classmethod
    def validate_dish_name(cls, v: str) -> str:
        name = v.strip() if isinstance(v, str) else v
        if not name:
            return name
        if len(name) == 1:
            raise ValueError("Dish name too short")
        if re.search(r"[0-9]", name):
            raise ValueError("Dish name must not contain numbers")
        if not re.fullmatch(r"[A-Za-z ]+", name):
            raise ValueError("Dish name contains invalid special characters")
        return name


class MealLogOut(BaseModel):
    id: int
    dish_name: str
    matched_name: Optional[str] = None
    fdc_id: Optional[int] = None
    servings: int
    calories_per_serving: float
    total_calories: float
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    carbs_g: Optional[float] = None
    ingredients_text: Optional[str] = None

    class Config:
        from_attributes = True


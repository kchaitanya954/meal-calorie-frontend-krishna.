from typing import Optional
from pydantic import BaseModel, EmailStr, Field


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
    dish_name: str
    servings: int
    note: Optional[str] = None


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


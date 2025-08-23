from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class GetCaloriesRequest(BaseModel):
    dish_name: str = Field(min_length=0, max_length=100)
    servings: int = Field(gt=0, le=100)

    @field_validator("dish_name", mode="before")
    @classmethod
    def validate_dish_name(cls, v: str) -> str:
        name = v.strip()
        if not name:
            return name
        if len(name) == 1:
            raise ValueError("Dish name too short")
        # Allow letters and spaces only
        import re
        if re.search(r"[0-9]", name):
            raise ValueError("Dish name must not contain numbers")
        if not re.fullmatch(r"[A-Za-z ]+", name):
            raise ValueError("Dish name contains invalid special characters")
        return name


class MacroNutrients(BaseModel):
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    carbs_g: Optional[float] = None


class GetCaloriesResponse(BaseModel):
    dish_name: str
    matched_name: Optional[str] = None
    fdc_id: Optional[int] = None
    servings: int
    calories_per_serving: float
    total_calories: float
    source: str = "USDA FoodData Central"
    ingredients_text: Optional[str] = None
    macros_per_serving: Optional[MacroNutrients] = None
    suggestions: Optional[List[str]] = None


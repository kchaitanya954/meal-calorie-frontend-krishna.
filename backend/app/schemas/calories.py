from typing import List, Optional

from pydantic import BaseModel, Field


class GetCaloriesRequest(BaseModel):
    dish_name: str = Field(min_length=2)
    servings: int = Field(gt=0)


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


from typing import List

from fastapi import APIRouter, Depends, Request, HTTPException, status
from app.core.rate_limiter import limiter
from app.core.config import settings
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import MealLog
from app.schemas.auth import MealLogCreate, MealLogOut
from app.services.usda_service import calculate_calories


router = APIRouter()


@router.post("/meals", response_model=MealLogOut)
@limiter.limit(settings.RATE_LIMIT)
async def create_meal(request: Request, payload: MealLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Compute nutrition via USDA service
    result = await calculate_calories(payload.dish_name, payload.servings)

    meal = MealLog(
        user_id=user.id,
        dish_name=result.dish_name,
        matched_name=result.matched_name or result.dish_name,
        fdc_id=result.fdc_id or 0,
        servings=result.servings,
        calories_per_serving=result.calories_per_serving,
        total_calories=result.total_calories,
        protein_g=(result.macros_per_serving.protein_g if result.macros_per_serving else None),
        fat_g=(result.macros_per_serving.fat_g if result.macros_per_serving else None),
        carbs_g=(result.macros_per_serving.carbs_g if result.macros_per_serving else None),
        ingredients_text=result.ingredients_text,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


@router.get("/meals", response_model=List[MealLogOut])
def list_meals(db: Session = Depends(get_db), user=Depends(get_current_user)):
    meals = db.query(MealLog).filter(MealLog.user_id == user.id).order_by(MealLog.created_at.desc()).all()
    return meals


@router.delete("/meals/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(request: Request, meal_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    meal = db.query(MealLog).filter(MealLog.id == meal_id, MealLog.user_id == user.id).first()
    if not meal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return None


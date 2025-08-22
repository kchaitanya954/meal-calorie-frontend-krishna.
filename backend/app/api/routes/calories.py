from fastapi import APIRouter, Request, Depends

from app.core.rate_limiter import limiter
from app.schemas.calories import GetCaloriesRequest, GetCaloriesResponse
from app.services.usda_service import calculate_calories
from app.api.deps import get_current_user


router = APIRouter()


@router.post("/get-calories", response_model=GetCaloriesResponse)
@limiter.limit("15/minute")
async def get_calories(request: Request, payload: GetCaloriesRequest, user=Depends(get_current_user)):
    response = await calculate_calories(payload.dish_name, payload.servings)
    return response


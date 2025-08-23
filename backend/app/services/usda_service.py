from typing import Any, Dict, List, Optional

import httpx

from app.core.cache import InMemoryTTLCache
from app.core.config import settings
from rapidfuzz import fuzz
from app.schemas.calories import GetCaloriesResponse, MacroNutrients
from app.utils.errors import AppError


cache = InMemoryTTLCache(default_ttl_seconds=settings.USDA_CACHE_TTL_SECONDS)


async def calculate_calories(dish_name: str, servings: int) -> GetCaloriesResponse:
    if servings <= 0:
        raise AppError("Invalid servings", 400)

    cache_key = f"usda:{dish_name.lower()}"
    cached = cache.get(cache_key)
    if cached:
        per_serving = cached["calories_per_serving"]
        return GetCaloriesResponse(
            dish_name=dish_name,
            matched_name=cached.get("matched_name"),
            fdc_id=cached.get("fdc_id"),
            servings=servings,
            calories_per_serving=per_serving,
            total_calories=per_serving * servings,
            ingredients_text=cached.get("ingredients_text"),
            macros_per_serving=MacroNutrients(
                protein_g=(cached.get("macros_per_serving") or {}).get("protein_g"),
                fat_g=(cached.get("macros_per_serving") or {}).get("fat_g"),
                carbs_g=(cached.get("macros_per_serving") or {}).get("carbs_g"),
            ),
        )

    params = {
        "query": dish_name,
        "pageSize": 10,
        "api_key": settings.USDA_API_KEY,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(settings.USDA_API_BASE_URL, params=params)
        if resp.status_code != 200:
            raise AppError("Failed to fetch from USDA API", 502)
        data = resp.json()

    foods = data.get("foods", [])
    if not foods:
        raise AppError("Dish not found", 404)

    # Fuzzy match: choose best by WRatio among returned foods
    scored = []
    for f in foods:
        name = f.get("description") or ""
        score = fuzz.WRatio(dish_name, name)
        scored.append((score, f))
    scored.sort(key=lambda x: x[0], reverse=True)
    best = scored[0][1]

    # Extract Energy from foodNutrients (nutrientId=1008 or nutrientName='Energy')
    energy_kcal: Optional[float] = None
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    carbs_g: Optional[float] = None
    for n in best.get("foodNutrients", []) or []:
        nutrient_id = n.get("nutrientId")
        nutrient_name = (n.get("nutrientName") or "").lower()
        if nutrient_id == 1008 or nutrient_name == "energy":
            try:
                energy_kcal = float(n.get("value"))
                break
            except (TypeError, ValueError):
                continue
        if nutrient_id == 1003 or nutrient_name == "protein":
            try:
                protein_g = float(n.get("value"))
            except (TypeError, ValueError):
                pass
        if nutrient_id == 1004 or nutrient_name in {"total lipid (fat)", "fat", "total fat"}:
            try:
                fat_g = float(n.get("value"))
            except (TypeError, ValueError):
                pass
        if nutrient_id == 1005 or nutrient_name.startswith("carbohydrate"):
            try:
                carbs_g = float(n.get("value"))
            except (TypeError, ValueError):
                pass

    if energy_kcal is None:
        raise AppError("Calories not available for this dish", 404)

    # Per 100g vs per serving scaling
    calories_per_serving = energy_kcal

    result = GetCaloriesResponse(
        dish_name=dish_name,
        matched_name=best.get("description"),
        fdc_id=best.get("fdcId"),
        servings=servings,
        calories_per_serving=calories_per_serving,
        total_calories=calories_per_serving * servings,
        ingredients_text=best.get("ingredients"),
        macros_per_serving=MacroNutrients(protein_g=protein_g, fat_g=fat_g, carbs_g=carbs_g),
    )

    cache.set(
        cache_key,
        {
            "calories_per_serving": calories_per_serving,
            "ingredients_text": best.get("ingredients"),
            "matched_name": best.get("description"),
            "fdc_id": best.get("fdcId"),
            "macros_per_serving": {
                "protein_g": protein_g,
                "fat_g": fat_g,
                "carbs_g": carbs_g,
            },
        },
    )
    return result


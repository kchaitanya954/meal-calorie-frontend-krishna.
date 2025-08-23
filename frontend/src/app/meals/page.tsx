"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { createMeal, deleteMeal } from '@/lib/api';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err);
  } catch {
    return 'Unexpected error';
  }
}

type Meal = {
  id: number;
  dish_name: string;
  matched_name?: string;
  servings: number;
  total_calories: number;
  calories_per_serving?: number;
  protein_g?: number | null;
  fat_g?: number | null;
  carbs_g?: number | null;
  ingredients_text?: string | null;
};

export default function MealsPage() {
  const authed = useAuthGuard();
  const token = useAuthStore((s) => s.token);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function reload() {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/meals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load meals');
      const data: Meal[] = await res.json();
      setMeals(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!authed) return null;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Meals</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formEl = e.currentTarget as HTMLFormElement;
          const fd = new FormData(formEl);
          const dish_name = String(fd.get('dish_name') || '');
          const servings = Number(fd.get('servings') || 1);
          if (!dish_name) return;
          setLoading(true);
          setError(null);
          try {
            await createMeal({ dish_name, servings }, token!);
            formEl.reset();
            await reload();
          } catch (err: unknown) {
            setError(getErrorMessage(err));
          } finally {
            setLoading(false);
          }
        }}
        className="flex gap-2 items-center"
      >
        <input name="dish_name" placeholder="Dish name" className="border p-2 rounded" />
        <input name="servings" type="number" min={1} defaultValue={1} className="border p-2 rounded w-24" />
        <button disabled={loading} className="bg-black text-white px-3 py-2 rounded">{loading ? 'Adding...' : 'Add meal'}</button>
      </form>

      <ul className="space-y-2">
        {meals.map((m) => (
          <li key={m.id} className="border rounded p-3">
            <div className="font-medium">{m.matched_name || m.dish_name}</div>
            <div className="text-sm text-gray-600">
              Servings: {m.servings} • Total: {m.total_calories.toFixed(1)} kcal
            </div>
            {typeof m.calories_per_serving === 'number' && (
              <div className="text-sm">Per serving: {m.calories_per_serving.toFixed(1)} kcal</div>
            )}
            {(m.protein_g != null || m.fat_g != null || m.carbs_g != null) && (
              <div className="text-sm mt-1">
                Macros: Protein {m.protein_g ?? 0} g • Fat {m.fat_g ?? 0} g • Carbs {m.carbs_g ?? 0} g
              </div>
            )}
            {m.ingredients_text && (
              <div className="text-xs text-gray-700 mt-1 line-clamp-2">Ingredients: {m.ingredients_text}</div>
            )}
            <div className="mt-2">
              <button
                className="text-red-600 underline text-sm"
                onClick={async () => {
                  try {
                    await deleteMeal(m.id, token!);
                    await reload();
                  } catch {
                    // ignore
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


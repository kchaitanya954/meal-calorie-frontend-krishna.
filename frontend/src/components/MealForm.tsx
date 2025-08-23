"use client";
import { useState } from 'react';
import { getCalories } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useMealStore } from '@/stores/mealStore';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err);
  } catch {
    return 'Unexpected error';
  }
}

export default function MealForm() {
  const token = useAuthStore((s) => s.token);
  const setResult = useMealStore((s) => s.setResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError('Please login first');
      return;
    }
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await getCalories({
        dish_name: String(fd.get('dish_name') || ''),
        servings: Number(fd.get('servings') || 1),
      }, token);
      setResult(res);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md w-full">
      <input className="border p-2 rounded w-full" name="dish_name" placeholder="Dish name (e.g., Cheddar Cheese)" required />
      <input className="border p-2 rounded w-full" name="servings" type="number" min={1} defaultValue={1} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
        {loading ? 'Loading...' : 'Get calories'}
      </button>
    </form>
  );
}


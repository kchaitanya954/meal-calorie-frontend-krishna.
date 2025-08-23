"use client";
import { useMealStore } from '@/stores/mealStore';
import { useAuthStore } from '@/stores/authStore';
import { createMeal } from '@/lib/api';
import { useState } from 'react';

export default function ResultCard() {
  const result = useMealStore((s) => s.lastResult);
  const token = useAuthStore((s) => s.token);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  if (!result) return null;

  return (
    <div className="border rounded p-4 w-full max-w-xl">
      <h2 className="text-lg font-semibold mb-2">{result.matched_name || result.dish_name}</h2>
      <p className="text-sm text-gray-600">Source: {result.source}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>Servings: <b>{result.servings}</b></div>
        <div>Per serving: <b>{result.calories_per_serving.toFixed(1)} kcal</b></div>
        <div>Total: <b>{result.total_calories.toFixed(1)} kcal</b></div>
        {result.fdc_id && <div>FDC ID: {result.fdc_id}</div>}
      </div>
      {result.macros_per_serving && (
        <div className="mt-3 text-sm">
          <div className="font-medium mb-1">Macros per serving</div>
          <div className="grid grid-cols-3 gap-2">
            <div>Protein: {result.macros_per_serving.protein_g ?? 0} g</div>
            <div>Fat: {result.macros_per_serving.fat_g ?? 0} g</div>
            <div>Carbs: {result.macros_per_serving.carbs_g ?? 0} g</div>
          </div>
        </div>
      )}
      {result.ingredients_text && (
        <div className="mt-3 text-sm">
          <div className="font-medium mb-1">Ingredients</div>
          <p className="whitespace-pre-wrap text-gray-800">{result.ingredients_text}</p>
        </div>
      )}
      <div className="mt-4">
        <button
          disabled={!token || saving}
          onClick={async () => {
            if (!token) return;
            setMsg(null);
            setSaving(true);
            try {
              await createMeal({ dish_name: result.dish_name, servings: result.servings }, token);
              setMsg('Meal saved!');
            } catch (e: any) {
              setMsg(e.message || 'Failed to save');
            } finally {
              setSaving(false);
            }
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save this meal'}
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>
    </div>
  );
}


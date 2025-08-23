import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CaloriesResponse } from '@/lib/api';

interface MealState {
  lastResult: CaloriesResponse | null;
  setResult: (r: CaloriesResponse | null) => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      setResult: (r) => set({ lastResult: r }),
    }),
    { name: 'meal-store' }
  )
);


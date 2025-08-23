function normalizeBaseUrl(raw?: string): string {
  let url = raw && raw.trim() ? raw.trim() : 'http://localhost:8000';
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`; // ensure absolute URL in production
  }
  // drop trailing slash to avoid //path
  if (url.endsWith('/')) url = url.slice(0, -1);
  return url;
}

const BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
  });
  if (!res.ok) {
    let message =
      res.status === 429
        ? 'Rate limit exceeded. Please wait a minute and try again.'
        : res.status === 401
        ? 'Unauthorized. Please login.'
        : 'Request failed';
    try {
      const data = await res.json();
      message = data?.detail || message;
    } catch (_) {}
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return res.json() as Promise<T>;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(payload: RegisterPayload) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.set('username', email);
  body.set('password', password);
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

export interface GetCaloriesPayload {
  dish_name: string;
  servings: number;
}

export interface MacrosResponse {
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
}

export interface CaloriesResponse {
  dish_name: string;
  matched_name?: string;
  fdc_id?: number;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  ingredients_text?: string;
  macros_per_serving?: MacrosResponse;
  suggestions?: string[];
}

export async function getCalories(payload: GetCaloriesPayload, token: string): Promise<CaloriesResponse> {
  return request<CaloriesResponse>('/get-calories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export interface MealLogCreate {
  dish_name: string;
  servings: number;
}

export async function createMeal(payload: MealLogCreate, token: string) {
  return request('/meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteMeal(mealId: number, token: string) {
  return request(`/meals/${mealId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface MealLogOut {
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
}

export async function getMeals(token: string): Promise<MealLogOut[]> {
  return request<MealLogOut[]>('/meals', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


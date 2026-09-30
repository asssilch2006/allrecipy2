import { RecipeDetail, RecipeSummary } from '../types';

export interface IngredientSearchParams {
  ingredients: string[];
  number?: number;
  ranking?: 1 | 2;
}

export interface NutrientSearchParams {
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  number?: number;
}

export interface ComplexSearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  maxReadyTime?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  number?: number;
  offset?: number;
}

// 1. POST /api/spoon/find-by-ingredients
export async function findByIngredients(params: IngredientSearchParams): Promise<RecipeSummary[]> {
  const res = await fetch('/api/spoon/find-by-ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to find recipes by ingredients (${res.status})`);
  }
  return res.json();
}

// 2. GET /api/spoon/recipe/:id
export async function getRecipeById(id: number): Promise<RecipeDetail> {
  const res = await fetch(`/api/spoon/recipe/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load recipe #${id} (${res.status})`);
  }
  return res.json();
}

// 3. POST /api/spoon/find-by-nutrients
export async function findByNutrients(filters: NutrientSearchParams): Promise<RecipeSummary[]> {
  const res = await fetch('/api/spoon/find-by-nutrients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  if (!res.ok) {
    throw new Error(`Failed to filter recipes by nutrients (${res.status})`);
  }
  return res.json();
}

// 4. GET /api/spoon/complexSearch
export async function searchRecipes(params: ComplexSearchParams): Promise<{
  results: RecipeSummary[];
  totalResults: number;
}> {
  const query = new URLSearchParams();
  if (params.query) query.set('query', params.query);
  if (params.cuisine) query.set('cuisine', params.cuisine);
  if (params.diet) query.set('diet', params.diet);
  if (params.type) query.set('type', params.type);
  if (params.maxReadyTime) query.set('maxReadyTime', String(params.maxReadyTime));
  if (params.sort) query.set('sort', params.sort);
  if (params.sortDirection) query.set('sortDirection', params.sortDirection);
  if (params.number) query.set('number', String(params.number));
  if (params.offset) query.set('offset', String(params.offset));

  const res = await fetch(`/api/spoon/complexSearch?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Recipe search failed (${res.status})`);
  }
  return res.json();
}

// 5. GET /api/spoon/random
export async function getRandomRecipes(number: number = 8, tags?: string): Promise<{ recipes: RecipeDetail[] }> {
  const query = new URLSearchParams();
  query.set('number', String(number));
  if (tags) query.set('tags', tags);

  const res = await fetch(`/api/spoon/random?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load trending recipes (${res.status})`);
  }
  return res.json();
}

// 6. POST /api/ai/chef
export async function askAiChef(
  message: string,
  recipeContext?: { title: string; ingredients?: string[] },
  conversationHistory?: Array<{ role: 'user' | 'model'; text: string }>
): Promise<{ reply: string }> {
  const res = await fetch('/api/ai/chef', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, recipeContext, conversationHistory }),
  });
  if (!res.ok) {
    throw new Error('AI Chef connection failed');
  }
  return res.json();
}

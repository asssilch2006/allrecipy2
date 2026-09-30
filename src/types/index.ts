export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
  aisle?: string;
  image?: string;
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients?: Array<{ id: number; name: string; image?: string }>;
  equipment?: Array<{ id: number; name: string; image?: string }>;
  length?: {
    number: number;
    unit: string;
  };
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl?: string;
  aggregateLikes?: number;
  healthScore?: number;
  spoonacularScore?: number;
  pricePerServing?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  summary: string;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  extendedIngredients: Ingredient[];
  analyzedInstructions: AnalyzedInstruction[];
  nutrition?: {
    nutrients: Nutrient[];
    caloricBreakdown?: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
  };
}

export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  calories?: number | string;
  protein?: string;
  carbs?: string;
  fat?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: Array<{ id: number; name: string; original: string }>;
  usedIngredients?: Array<{ id: number; name: string; original: string }>;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  healthScore?: number;
  diets?: string[];
  dishTypes?: string[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DayPlan {
  breakfast?: RecipeSummary | null;
  lunch?: RecipeSummary | null;
  dinner?: RecipeSummary | null;
  snacks?: RecipeSummary | null;
}

export type WeeklyPlan = Record<DayOfWeek, DayPlan>;

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  recipeSource?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

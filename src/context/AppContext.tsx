import React, { createContext, useContext, useState, useEffect } from 'react';
import { DayOfWeek, GroceryItem, MealType, RecipeDetail, RecipeSummary, WeeklyPlan } from '../types';
import { getRecipeById } from '../services/api';

export type ActiveTab = 'home' | 'recipes' | 'planner' | 'grocery' | 'cooking' | 'details' | 'shop';

interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  size: string;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedRecipeId: number | null;
  selectedRecipe: RecipeDetail | null;
  isLoadingRecipe: boolean;
  cookingRecipe: RecipeDetail | null;
  weeklyPlan: WeeklyPlan;
  groceryList: GroceryItem[];
  favorites: number[];
  isAiChefOpen: boolean;
  toasts: ToastInfo[];
  cartCount: number;
  
  addToCart: (item: CartItem) => void;
  openRecipeDetails: (id: number) => void;
  startCooking: (recipe: RecipeDetail) => void;
  exitCooking: () => void;
  addToMealPlan: (day: DayOfWeek, meal: MealType, recipe: RecipeSummary) => void;
  removeFromMealPlan: (day: DayOfWeek, meal: MealType) => void;
  generateGroceryListFromPlan: () => Promise<void>;
  addGroceryItem: (name: string, amount?: number, unit?: string, category?: string, recipeSource?: string) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  clearCheckedGroceryItems: () => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleAiChef: () => void;
  setAiChefOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'info') => void;
  dismissToast: (id: number) => void;
}

const DEFAULT_WEEKLY_PLAN: WeeklyPlan = {
  Monday: {
    breakfast: {
      id: 632660,
      title: 'Artisan Shakshuka with Poached Eggs & Feta',
      image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
      readyInMinutes: 25,
      calories: 320,
    },
    lunch: null,
    dinner: {
      id: 716429,
      title: 'Pasta with Garlic, Scallions & Cauliflower',
      image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
      readyInMinutes: 30,
      calories: 485,
    },
  },
  Tuesday: {
    breakfast: null,
    lunch: {
      id: 715538,
      title: 'Mediterranean Quinoa Nourish Bowl',
      image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
      readyInMinutes: 25,
      calories: 520,
    },
    dinner: null,
  },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

const DEFAULT_GROCERY_LIST: GroceryItem[] = [
  { id: '1', name: 'Fresh garlic bulb', amount: 1, unit: 'head', category: 'Produce', checked: false, recipeSource: 'Pasta with Garlic' },
  { id: '2', name: 'Cauliflower florets', amount: 3, unit: 'cups', category: 'Produce', checked: false, recipeSource: 'Pasta with Garlic' },
  { id: '3', name: 'Extra virgin olive oil', amount: 1, unit: 'bottle', category: 'Pantry', checked: true },
  { id: '4', name: 'Pasture-raised eggs', amount: 6, unit: 'count', category: 'Dairy & Eggs', checked: false, recipeSource: 'Artisan Shakshuka' },
  { id: '5', name: 'Crushed San Marzano tomatoes', amount: 1, unit: 'can', category: 'Canned Goods', checked: false, recipeSource: 'Artisan Shakshuka' },
  { id: '6', name: 'Sesame tahini', amount: 1, unit: 'jar', category: 'Pantry', checked: false, recipeSource: 'Quinoa Bowl' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<RecipeDetail | null>(null);
  const [isAiChefOpen, setAiChefOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persistent storage with state
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    try {
      const saved = localStorage.getItem('allrecipy_meal_plan');
      return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_PLAN;
    } catch {
      return DEFAULT_WEEKLY_PLAN;
    }
  });

  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('allrecipy_grocery_list');
      return saved ? JSON.parse(saved) : DEFAULT_GROCERY_LIST;
    } catch {
      return DEFAULT_GROCERY_LIST;
    }
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('allrecipy_favorites');
      return saved ? JSON.parse(saved) : [716429, 715538];
    } catch {
      return [716429, 715538];
    }
  });

  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('allrecipy_cart_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const addToCart = (item: CartItem) => {
    setCartCount((prev) => {
      const next = prev + item.quantity;
      try {
        localStorage.setItem('allrecipy_cart_count', String(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    // Also optionally append to grocery items for convenient in-kitchen integration!
    addGroceryItem(`${item.name} (${item.size})`, item.quantity, 'pack', 'Pantry');
    showToast(`Added ${item.quantity}× ${item.name} to cart!`, 'success');
  };

  useEffect(() => {
    try {
      localStorage.setItem('allrecipy_meal_plan', JSON.stringify(weeklyPlan));
    } catch (e) {
      console.warn(e);
    }
  }, [weeklyPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('allrecipy_grocery_list', JSON.stringify(groceryList));
    } catch (e) {
      console.warn(e);
    }
  }, [groceryList]);

  useEffect(() => {
    try {
      localStorage.setItem('allrecipy_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
  }, [favorites]);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => {
      // FIFO Queue: Limit maximum visible notifications to 3 at any time
      const next = [...prev, { id, message, type }];
      if (next.length > 3) {
        return next.slice(next.length - 3);
      }
      return next;
    });
  };

  const openRecipeDetails = async (id: number) => {
    setSelectedRecipeId(id);
    setActiveTab('details');
    setIsLoadingRecipe(true);
    try {
      const recipe = await getRecipeById(id);
      setSelectedRecipe(recipe);
    } catch (err) {
      console.error('Failed to load recipe details:', err);
      showToast('Could not load full recipe, showing cached preview', 'info');
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const startCooking = (recipe: RecipeDetail) => {
    setCookingRecipe(recipe);
    setActiveTab('cooking');
  };

  const exitCooking = () => {
    if (selectedRecipeId) {
      setActiveTab('details');
    } else {
      setActiveTab('home');
    }
  };

  const addToMealPlan = (day: DayOfWeek, meal: MealType, recipe: RecipeSummary) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipe,
      },
    }));
    showToast(`Added "${recipe.title.slice(0, 24)}..." to ${day} ${meal}!`);
  };

  const removeFromMealPlan = (day: DayOfWeek, meal: MealType) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: null,
      },
    }));
    showToast(`Removed from ${day} ${meal}`, 'info');
  };

  const generateGroceryListFromPlan = async () => {
    const recipeIds: number[] = [];
    const recipeTitles: Record<number, string> = {};

    Object.values(weeklyPlan).forEach((day) => {
      if (day.breakfast?.id) {
        recipeIds.push(day.breakfast.id);
        recipeTitles[day.breakfast.id] = day.breakfast.title;
      }
      if (day.lunch?.id) {
        recipeIds.push(day.lunch.id);
        recipeTitles[day.lunch.id] = day.lunch.title;
      }
      if (day.dinner?.id) {
        recipeIds.push(day.dinner.id);
        recipeTitles[day.dinner.id] = day.dinner.title;
      }
    });

    const uniqueIds = Array.from(new Set(recipeIds));
    if (uniqueIds.length === 0) {
      showToast('Your meal planner is empty! Add meals first.', 'info');
      return;
    }

    showToast('Generating smart grocery list from weekly meals...', 'info');

    const newItems: GroceryItem[] = [];

    for (const id of uniqueIds) {
      try {
        const recipe = await getRecipeById(id);
        if (recipe.extendedIngredients) {
          recipe.extendedIngredients.forEach((ing) => {
            newItems.push({
              id: `${id}-${ing.id}-${Math.random().toString(36).slice(2, 6)}`,
              name: ing.name || ing.original,
              amount: ing.amount || 1,
              unit: ing.unit || '',
              category: ing.aisle || 'Pantry & Dry Goods',
              checked: false,
              recipeSource: recipeTitles[id] || recipe.title,
            });
          });
        }
      } catch (e) {
        console.error('Error fetching recipe ingredients:', e);
      }
    }

    if (newItems.length > 0) {
      setGroceryList((prev) => {
        // Merge without repeating exact same name and source
        const existingKeys = new Set(prev.map((i) => `${i.name.toLowerCase()}-${i.recipeSource}`));
        const filteredNew = newItems.filter((i) => !existingKeys.has(`${i.name.toLowerCase()}-${i.recipeSource}`));
        return [...prev, ...filteredNew];
      });
      showToast(`Added ${newItems.length} ingredients to your Grocery List!`);
      setActiveTab('grocery');
    } else {
      showToast('Could not fetch ingredients for planned meals.', 'info');
    }
  };

  const addGroceryItem = (name: string, amount: number = 1, unit: string = '', category: string = 'General', recipeSource?: string) => {
    if (!name.trim()) return;
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: name.trim(),
      amount,
      unit,
      category: category || 'Pantry & Dry Goods',
      checked: false,
      recipeSource,
    };
    setGroceryList((prev) => [newItem, ...prev]);
    showToast(`Added "${name}" to grocery list`);
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCheckedGroceryItems = () => {
    const checkedCount = groceryList.filter((i) => i.checked).length;
    setGroceryList((prev) => prev.filter((item) => !item.checked));
    if (checkedCount > 0) {
      showToast(`Cleared ${checkedCount} purchased items`);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to favorites! ❤️');
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  const toggleAiChef = () => setAiChefOpen((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedRecipeId,
        selectedRecipe,
        isLoadingRecipe,
        cookingRecipe,
        weeklyPlan,
        groceryList,
        favorites,
        isAiChefOpen,
        toasts,
        cartCount,
        addToCart,
        openRecipeDetails,
        startCooking,
        exitCooking,
        addToMealPlan,
        removeFromMealPlan,
        generateGroceryListFromPlan,
        addGroceryItem,
        toggleGroceryItem,
        removeGroceryItem,
        clearCheckedGroceryItems,
        toggleFavorite,
        isFavorite,
        toggleAiChef,
        setAiChefOpen,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

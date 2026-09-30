import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ShoppingBag,
  Plus,
  Trash2,
  Play,
  Sparkles,
  ChefHat,
  Search,
  Filter,
  Check,
  ArrowRight,
  GripVertical,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Printer,
  X,
  Share2,
  Leaf,
  Apple,
  Sunrise,
  Sun,
  Moon,
  Cookie,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek, MealType, RecipeSummary, GroceryItem } from '../../types';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_CONFIG: Record<
  MealType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgLight: string;
    borderCol: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  breakfast: {
    label: 'Breakfast',
    icon: Sunrise,
    accentColor: '#D97706',
    bgLight: 'bg-amber-50/70',
    borderCol: 'border-amber-200/80',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  lunch: {
    label: 'Lunch',
    icon: Sun,
    accentColor: '#059669',
    bgLight: 'bg-emerald-50/70',
    borderCol: 'border-emerald-200/80',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  dinner: {
    label: 'Dinner',
    icon: Moon,
    accentColor: '#E11D48',
    bgLight: 'bg-rose-50/70',
    borderCol: 'border-rose-200/80',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
  },
  snacks: {
    label: 'Snacks',
    icon: Cookie,
    accentColor: '#0284C7',
    bgLight: 'bg-sky-50/70',
    borderCol: 'border-sky-200/80',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
  },
};

// Rich recipe bank dataset with distinct meal categories, tags & ingredients
interface BankRecipe extends RecipeSummary {
  diet: 'keto' | 'vegan' | 'high-protein' | 'quick' | 'snack';
  defaultMeal: MealType;
  ingredientsList: Array<{ name: string; amount: number; unit: string; category: string }>;
}

const RECIPE_BANK: BankRecipe[] = [
  // Breakfasts
  {
    id: 632660,
    title: 'Artisan Shakshuka with Poached Farm Eggs & Feta',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 20,
    calories: 320,
    diet: 'quick',
    defaultMeal: 'breakfast',
    ingredientsList: [
      { name: 'Large Eggs', amount: 3, unit: 'count', category: 'Dairy & Eggs' },
      { name: 'Crushed Tomatoes', amount: 1, unit: 'can', category: 'Pantry' },
      { name: 'Greek Feta Cheese', amount: 0.5, unit: 'cup', category: 'Dairy & Eggs' },
      { name: 'Bell Peppers', amount: 2, unit: 'count', category: 'Produce' },
    ],
  },
  {
    id: 800104,
    title: 'Fluffy Almond Flour Pancakes with Fresh Berries',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 18,
    calories: 360,
    diet: 'keto',
    defaultMeal: 'breakfast',
    ingredientsList: [
      { name: 'Blanched Almond Flour', amount: 1.5, unit: 'cups', category: 'Pantry' },
      { name: 'Pasture Eggs', amount: 2, unit: 'count', category: 'Dairy & Eggs' },
      { name: 'Almond Milk', amount: 0.5, unit: 'cup', category: 'Dairy & Eggs' },
      { name: 'Fresh Blueberries', amount: 0.5, unit: 'cup', category: 'Produce' },
    ],
  },
  {
    id: 800107,
    title: 'Keto Herbed Almond Biscuits with Avocado',
    image: '/src/assets/images/product_almond_flour_baking_1790776734673.jpg',
    readyInMinutes: 22,
    calories: 310,
    diet: 'keto',
    defaultMeal: 'breakfast',
    ingredientsList: [
      { name: 'Almond Flour', amount: 1, unit: 'cup', category: 'Pantry' },
      { name: 'Ripe Hass Avocado', amount: 1, unit: 'count', category: 'Produce' },
      { name: 'Fresh Chives', amount: 2, unit: 'tbsp', category: 'Produce' },
    ],
  },

  // Lunches
  {
    id: 715538,
    title: 'Mediterranean Quinoa Nourish Bowl with Tahini',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 25,
    calories: 520,
    diet: 'vegan',
    defaultMeal: 'lunch',
    ingredientsList: [
      { name: 'Tri-Color Quinoa', amount: 1, unit: 'cup', category: 'Pantry' },
      { name: 'Chickpeas', amount: 1, unit: 'can', category: 'Pantry' },
      { name: 'Avocado', amount: 1, unit: 'count', category: 'Produce' },
      { name: 'Purple Cabbage', amount: 1, unit: 'cup', category: 'Produce' },
      { name: 'Sesame Tahini', amount: 3, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    id: 800101,
    title: 'Avocado Cobb Salad with Herb Grilled Chicken',
    image: '/src/assets/images/recipe_avocado_keto_salad_1790308634626.jpg',
    readyInMinutes: 15,
    calories: 430,
    diet: 'high-protein',
    defaultMeal: 'lunch',
    ingredientsList: [
      { name: 'Chicken Breast', amount: 2, unit: 'fillets', category: 'Meat & Seafood' },
      { name: 'Baby Spinach', amount: 3, unit: 'cups', category: 'Produce' },
      { name: 'Soft Boiled Eggs', amount: 2, unit: 'count', category: 'Dairy & Eggs' },
      { name: 'Avocado', amount: 1, unit: 'count', category: 'Produce' },
    ],
  },
  {
    id: 716429,
    title: 'Artisan Pasta with Garlic & Crispy Cauliflower',
    image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
    readyInMinutes: 25,
    calories: 485,
    diet: 'quick',
    defaultMeal: 'lunch',
    ingredientsList: [
      { name: 'Artisan Pasta', amount: 300, unit: 'g', category: 'Pantry' },
      { name: 'Fresh Cauliflower', amount: 1, unit: 'head', category: 'Produce' },
      { name: 'Garlic Cloves', amount: 4, unit: 'cloves', category: 'Produce' },
      { name: 'Olive Oil', amount: 3, unit: 'tbsp', category: 'Pantry' },
    ],
  },

  // Dinners
  {
    id: 649931,
    title: 'One-Pan Citrus Wild Salmon with Asparagus',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    calories: 460,
    diet: 'high-protein',
    defaultMeal: 'dinner',
    ingredientsList: [
      { name: 'Wild Salmon Fillets', amount: 2, unit: 'fillets', category: 'Meat & Seafood' },
      { name: 'Fresh Asparagus', amount: 1, unit: 'bunch', category: 'Produce' },
      { name: 'Meyer Lemon', amount: 1, unit: 'count', category: 'Produce' },
      { name: 'Grass-Fed Butter', amount: 2, unit: 'tbsp', category: 'Dairy & Eggs' },
    ],
  },
  {
    id: 800103,
    title: 'Air Fryer Crispy Herb Chicken Thighs',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 22,
    calories: 410,
    diet: 'high-protein',
    defaultMeal: 'dinner',
    ingredientsList: [
      { name: 'Chicken Thighs', amount: 4, unit: 'count', category: 'Meat & Seafood' },
      { name: 'Fresh Rosemary', amount: 2, unit: 'sprigs', category: 'Produce' },
      { name: 'Garlic Powder', amount: 1, unit: 'tsp', category: 'Pantry' },
    ],
  },
  {
    id: 800105,
    title: 'Almond-Crusted Chicken Cutlets with Dijon',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    calories: 395,
    diet: 'keto',
    defaultMeal: 'dinner',
    ingredientsList: [
      { name: 'Chicken Cutlets', amount: 2, unit: 'fillets', category: 'Meat & Seafood' },
      { name: 'Almond Flour', amount: 0.75, unit: 'cup', category: 'Pantry' },
      { name: 'Dijon Mustard', amount: 2, unit: 'tbsp', category: 'Pantry' },
    ],
  },
  {
    id: 800102,
    title: 'Golden Coconut Curry with Crispy Tofu & Lime',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 25,
    calories: 390,
    diet: 'vegan',
    defaultMeal: 'dinner',
    ingredientsList: [
      { name: 'Firm Tofu', amount: 1, unit: 'block', category: 'Produce' },
      { name: 'Coconut Milk', amount: 1, unit: 'can', category: 'Pantry' },
      { name: 'Fresh Ginger', amount: 1, unit: 'thumb', category: 'Produce' },
      { name: 'Limes', amount: 2, unit: 'count', category: 'Produce' },
    ],
  },

  // Snacks
  {
    id: 800201,
    title: 'Raw Almond Butter Energy Bites with Chia',
    image: '/src/assets/images/product_almond_flour_texture_1790776721424.jpg',
    readyInMinutes: 10,
    calories: 180,
    diet: 'snack',
    defaultMeal: 'snacks',
    ingredientsList: [
      { name: 'Almond Butter', amount: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Chia Seeds', amount: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'Dark Chocolate Chips', amount: 0.25, unit: 'cup', category: 'Pantry' },
    ],
  },
  {
    id: 800202,
    title: 'Crispy Air Fryer Rosemary Chickpeas',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 15,
    calories: 190,
    diet: 'snack',
    defaultMeal: 'snacks',
    ingredientsList: [
      { name: 'Chickpeas', amount: 1, unit: 'can', category: 'Pantry' },
      { name: 'Olive Oil', amount: 1, unit: 'tbsp', category: 'Pantry' },
      { name: 'Smoked Paprika', amount: 1, unit: 'tsp', category: 'Pantry' },
    ],
  },
];

export const PlannerView: React.FC = () => {
  const {
    weeklyPlan,
    removeFromMealPlan,
    addToMealPlan,
    openRecipeDetails,
    showToast,
    setActiveTab,
  } = useApp();

  // Search & Filters for right-hand Recipe Bank
  const [bankSearch, setBankSearch] = useState('');
  const [bankFilter, setBankFilter] = useState<'all' | 'keto' | 'vegan' | 'high-protein' | 'quick' | 'snack'>('all');

  // Drag state
  const [draggedRecipe, setDraggedRecipe] = useState<BankRecipe | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Grocery list collapsible panel state
  const [isGroceryOpen, setIsGroceryOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Filtered recipes in bank
  const filteredBank = useMemo(() => {
    return RECIPE_BANK.filter((r) => {
      if (bankFilter !== 'all' && r.diet !== bankFilter) return false;
      if (bankSearch.trim()) {
        const q = bankSearch.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesIng = r.ingredientsList.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesIng) return false;
      }
      return true;
    });
  }, [bankSearch, bankFilter]);

  // Count planned meals
  const totalPlanned = useMemo(() => {
    let count = 0;
    DAYS.forEach((d) => {
      const plan = weeklyPlan[d];
      if (plan?.breakfast) count++;
      if (plan?.lunch) count++;
      if (plan?.dinner) count++;
      if (plan?.snacks) count++;
    });
    return count;
  }, [weeklyPlan]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, recipe: BankRecipe) => {
    setDraggedRecipe(recipe);
    e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverSlot !== slotId) {
      setDragOverSlot(slotId);
    }
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, day: DayOfWeek, meal: MealType) => {
    e.preventDefault();
    setDragOverSlot(null);
    let recipeToAdd: RecipeSummary | null = draggedRecipe;

    if (!recipeToAdd) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) recipeToAdd = JSON.parse(raw);
      } catch (err) {
        console.warn('Could not parse dropped recipe:', err);
      }
    }

    if (recipeToAdd) {
      addToMealPlan(day, meal, recipeToAdd);
      showToast(`Added ${recipeToAdd.title} to ${day} ${MEAL_CONFIG[meal].label}!`, 'success');
      setDraggedRecipe(null);
    }
  };

  // Quick auto-populate balanced week template
  const handleAutoFillBalanced = () => {
    const breakfasts = RECIPE_BANK.filter((r) => r.defaultMeal === 'breakfast');
    const lunches = RECIPE_BANK.filter((r) => r.defaultMeal === 'lunch');
    const dinners = RECIPE_BANK.filter((r) => r.defaultMeal === 'dinner');
    const snacks = RECIPE_BANK.filter((r) => r.defaultMeal === 'snacks');

    DAYS.forEach((d, idx) => {
      addToMealPlan(d, 'breakfast', breakfasts[idx % breakfasts.length]);
      addToMealPlan(d, 'lunch', lunches[idx % lunches.length]);
      addToMealPlan(d, 'dinner', dinners[idx % dinners.length]);
      addToMealPlan(d, 'snacks', snacks[idx % snacks.length]);
    });
    showToast('Auto-generated a balanced 7-day meal plan!', 'success');
  };

  const handleClearWeek = () => {
    DAYS.forEach((d) => {
      removeFromMealPlan(d, 'breakfast');
      removeFromMealPlan(d, 'lunch');
      removeFromMealPlan(d, 'dinner');
      removeFromMealPlan(d, 'snacks');
    });
    showToast('Meal plan cleared for the week', 'info');
  };

  // Auto-generate categorized grocery list from current weekly plan
  const categorizedGrocery = useMemo(() => {
    const categories: Record<string, Array<{ id: string; name: string; amount: number; unit: string; recipeTitle: string }>> = {
      'Produce & Fresh Herbs': [],
      'Meat & Seafood': [],
      'Dairy & Farm Eggs': [],
      'Pantry Staples & Grains': [],
    };

    // Gather recipes in plan
    DAYS.forEach((d) => {
      const plan = weeklyPlan[d];
      (['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).forEach((meal) => {
        const item = plan?.[meal];
        if (!item) return;

        // Find match in RECIPE_BANK to pull real ingredients
        const match = RECIPE_BANK.find((b) => b.id === item.id || b.title === item.title);
        if (match) {
          match.ingredientsList.forEach((ing, ingIdx) => {
            let catKey = 'Pantry Staples & Grains';
            if (ing.category === 'Produce') catKey = 'Produce & Fresh Herbs';
            if (ing.category === 'Meat & Seafood') catKey = 'Meat & Seafood';
            if (ing.category === 'Dairy & Eggs') catKey = 'Dairy & Farm Eggs';

            const id = `${item.id}-${ingIdx}-${ing.name.toLowerCase().replace(/\s+/g, '-')}`;
            // Check if already in list to aggregate
            const existing = categories[catKey].find((x) => x.name.toLowerCase() === ing.name.toLowerCase());
            if (existing) {
              existing.amount += ing.amount;
            } else {
              categories[catKey].push({
                id,
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                recipeTitle: item.title,
              });
            }
          });
        } else {
          // Fallback basic item
          categories['Produce & Fresh Herbs'].push({
            id: `fallback-${item.id}`,
            name: `${item.title} ingredients`,
            amount: 1,
            unit: 'kit',
            recipeTitle: item.title,
          });
        }
      });
    });

    return categories;
  }, [weeklyPlan]);

  const totalGroceryItemsCount = useMemo(() => {
    return Object.values(categorizedGrocery).reduce((acc, items) => acc + items.length, 0);
  }, [categorizedGrocery]);

  const toggleCheckGrocery = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyGroceryList = () => {
    let text = '🛒 ALLRECIPY WEEKLY GROCERY LIST:\n\n';
    Object.entries(categorizedGrocery).forEach(([cat, items]) => {
      if (items.length > 0) {
        text += `[${cat.toUpperCase()}]\n`;
        items.forEach((i) => {
          text += `• ${i.amount} ${i.unit} ${i.name} (${i.recipeTitle})\n`;
        });
        text += '\n';
      }
    });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Grocery list copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      {/* 
        HEADER & SUMMARY BAR:
        Clean modern SaaS-like header with meal metrics, auto-fill, and clear actions
      */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#557A61] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4 text-[#557A61]" />
            <span>Interactive Nutrition & Schedule Studio</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Weekly Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Drag recipes directly from the right-hand Recipe Bank into Breakfast, Lunch, Dinner, or Snack slots. Your grocery list automatically compiles in real time below.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Live Meals Count Counter */}
          <div className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 tabular-nums">
            <span className="text-[#557A61]">{totalPlanned}</span> / 28 Slots Filled
          </div>

          <button
            onClick={handleAutoFillBalanced}
            className="min-h-[42px] px-4 py-2 bg-[#557A61]/10 hover:bg-[#557A61]/20 text-[#3E5C47] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Auto-fill 7 days with chef-balanced meals"
          >
            <Sparkles className="w-4 h-4 text-[#557A61]" />
            <span>Auto-Fill Plan</span>
          </button>

          {totalPlanned > 0 && (
            <button
              onClick={handleClearWeek}
              className="min-h-[42px] px-3.5 py-2 text-stone-400 hover:text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear all meals from this week"
            >
              Reset Week
            </button>
          )}
        </div>
      </div>

      {/* 
        MAIN STUDIO LAYOUT:
        Left/Center: 7-Day Calendar Grid (Monday–Sunday) with Breakfast, Lunch, Dinner, Snacks slots.
        Right: Recipe Bank Sidebar with smart search and dietary filter pills.
      */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ================= 7-DAY CALENDAR GRID (Left 8-9 cols) ================= */}
        <div className="xl:col-span-8 space-y-6">
          <div className="space-y-5">
            {DAYS.map((day) => {
              const dayPlan = weeklyPlan[day] || {};
              return (
                <div
                  key={day}
                  className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-4 text-left"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#557A61]" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                        {day}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-400 font-medium">
                      Breakfast · Lunch · Dinner · Snacks
                    </span>
                  </div>

                  {/* 4 Pastel-Differentiated Meal Slots (Breakfast, Lunch, Dinner, Snacks) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((mealType) => {
                      const cfg = MEAL_CONFIG[mealType];
                      const Icon = cfg.icon;
                      const mealItem = dayPlan[mealType];
                      const slotId = `${day}-${mealType}`;
                      const isOver = dragOverSlot === slotId;

                      return (
                        <div
                          key={mealType}
                          onDragOver={(e) => handleDragOver(e, slotId)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, day, mealType)}
                          className={`relative rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between min-h-[140px] ${
                            cfg.bgLight
                          } ${cfg.borderCol} ${
                            isOver
                              ? 'ring-2 ring-[#557A61] scale-102 bg-white shadow-md'
                              : 'hover:border-stone-300'
                          }`}
                        >
                          {/* Slot Header with Pastel Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText}`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{cfg.label}</span>
                            </span>

                            {mealItem && (
                              <button
                                onClick={() => removeFromMealPlan(day, mealType)}
                                className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                                title={`Remove ${mealItem.title}`}
                                aria-label="Remove meal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Meal Item Content or Empty Drop Target */}
                          {mealItem ? (
                            <div
                              onClick={() => openRecipeDetails(mealItem.id)}
                              className="group cursor-pointer flex-1 flex flex-col justify-between space-y-2"
                            >
                              <div className="flex items-start gap-2.5">
                                <img
                                  src={mealItem.image || '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg'}
                                  alt={mealItem.title}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/80 shadow-2xs group-hover:scale-105 transition-transform"
                                />
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#557A61] line-clamp-2 leading-snug transition-colors">
                                    {mealItem.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1 font-medium">
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="w-3 h-3 text-stone-400" />
                                      <span>{mealItem.readyInMinutes || 25}m</span>
                                    </span>
                                    <span>·</span>
                                    <span>{mealItem.calories || 420} kcal</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[10px] font-semibold text-[#557A61] border-t border-stone-200/40">
                                <span>Cook instructions</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-2 text-center rounded-xl border border-dashed border-stone-300/80 bg-white/40 text-stone-400 hover:bg-white hover:text-[#557A61] hover:border-[#557A61] transition-all select-none">
                              <Plus className="w-4 h-4 mb-1" />
                              <span className="text-[11px] font-semibold">Drop recipe here</span>
                              <span className="text-[9px] text-stone-400">or click in bank</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT-HAND SIDEBAR: RECIPE BANK ================= */}
        <aside className="xl:col-span-4 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 text-left sticky top-24">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#557A61]" />
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">Recipe Bank</h3>
                <span className="text-[11px] text-stone-400">Drag card into any calendar slot</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#557A61] bg-[#557A61]/10 px-2.5 py-0.5 rounded-full">
              {filteredBank.length} available
            </span>
          </div>

          {/* Smart Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              placeholder="Search bank (e.g. salmon, pancake, salad)..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#557A61] transition-colors"
            />
            {bankSearch && (
              <button
                onClick={() => setBankSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'keto', label: 'Keto' },
              { id: 'vegan', label: 'Vegan' },
              { id: 'high-protein', label: 'Protein' },
              { id: 'quick', label: '<25 Min' },
              { id: 'snack', label: 'Snacks' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setBankFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                  bankFilter === f.id
                    ? 'bg-[#557A61] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Draggable Recipe Cards List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredBank.map((recipe) => (
              <div
                key={recipe.id}
                draggable
                onDragStart={(e) => handleDragStart(e, recipe)}
                className="group relative bg-[#FAF8F5] hover:bg-white border border-stone-200/90 hover:border-[#557A61]/50 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="text-stone-300 group-hover:text-stone-500 shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-13 h-13 rounded-xl object-cover shrink-0 border border-stone-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#557A61] line-clamp-1 transition-colors">
                      {recipe.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{recipe.readyInMinutes}m</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-[#D97757]" />
                        <span>{recipe.calories} kcal</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-stone-200/50">
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                        Default: {recipe.defaultMeal}
                      </span>

                      {/* Quick Assign fallback button */}
                      <button
                        onClick={() => {
                          addToMealPlan('Monday', recipe.defaultMeal, recipe);
                          showToast(`Added ${recipe.title} to Monday!`, 'success');
                        }}
                        className="text-[10px] font-bold text-[#557A61] hover:underline"
                        title="Click to assign to Monday"
                      >
                        + Add to Mon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredBank.length === 0 && (
              <div className="p-6 text-center text-xs text-stone-400 italic">
                No recipes match "{bankSearch}". Try resetting filters.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 
        BOTTOM COLLAPSIBLE PANEL:
        Auto-Generated, Categorized 'Grocery List' updating dynamically based on selected meals,
        with checkboxes for shopping.
      */}
      <section className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden text-left">
        {/* Collapsible Accordion Header */}
        <div
          onClick={() => setIsGroceryOpen(!isGroceryOpen)}
          className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#557A61] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-stone-900">
                  Smart Dynamic Grocery List
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#557A61] text-white text-xs font-bold tabular-nums">
                  {totalGroceryItemsCount} ingredients
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Automatically categorized & scaled from your {totalPlanned} planned meals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={copyGroceryList}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy checklist to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy List</span>
            </button>

            <button
              onClick={() => setActiveTab('grocery')}
              className="px-4 py-1.5 rounded-xl bg-[#557A61] hover:bg-[#3E5C47] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Full Aisle View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsGroceryOpen(!isGroceryOpen)}
              className="p-2 text-stone-400 hover:text-stone-700"
              aria-label="Toggle grocery list"
            >
              {isGroceryOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Categorized Checklist Grid */}
        {isGroceryOpen && (
          <div className="px-6 pb-7 border-t border-stone-100 pt-5 space-y-6 animate-in fade-in duration-200">
            {totalGroceryItemsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(categorizedGrocery).map(([categoryName, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={categoryName} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                          {categoryName}
                        </h4>
                        <span className="text-[11px] font-mono text-stone-400">
                          {items.filter((i) => checkedItems[i.id]).length}/{items.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {items.map((item) => {
                          const isChecked = !!checkedItems[item.id];
                          return (
                            <label
                              key={item.id}
                              className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                isChecked
                                  ? 'bg-stone-50 text-stone-400 line-through'
                                  : 'hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCheckGrocery(item.id)}
                                className="mt-0.5 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                              />
                              <div className="leading-snug min-w-0 flex-1">
                                <span className={isChecked ? 'line-through' : 'font-semibold text-stone-900'}>
                                  {item.amount > 0 ? item.amount : ''} {item.unit}{' '}
                                </span>
                                <span>{item.name}</span>
                                <span className="block text-[10px] text-stone-400 truncate">
                                  for {item.recipeTitle}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-400 italic">
                No meals planned yet. Drag recipes into any day slot above to automatically generate your shopping list.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

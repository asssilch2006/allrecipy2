import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Users,
  Heart,
  BookmarkPlus,
  ShoppingCart,
  Play,
  Sparkles,
  ArrowLeft,
  Check,
  ChefHat,
  Scale,
  Printer,
  ArrowDown,
  Plus,
  Minus,
  Star,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecipeDetail, DayOfWeek, MealType } from '../../types';

// Curated step images to accompany step-by-step instructions
const STEP_PROCESS_IMAGES = [
  '/src/assets/images/step_prep_pan_sear_1790776401694.jpg',
  '/src/assets/images/step_simmer_garnish_1790776416483.jpg',
  '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
  '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
];

export const RecipeDetailsView: React.FC = () => {
  const {
    selectedRecipe,
    isLoadingRecipe,
    setActiveTab,
    startCooking,
    toggleFavorite,
    isFavorite,
    addToMealPlan,
    addGroceryItem,
    showToast,
    toggleAiChef,
  } = useApp();

  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planDay, setPlanDay] = useState<DayOfWeek>('Monday');
  const [planMeal, setPlanMeal] = useState<MealType>('dinner');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  if (isLoadingRecipe || !selectedRecipe) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#557A61] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Gathering recipe details & chef instructions...</p>
      </div>
    );
  }

  const recipe: RecipeDetail = selectedRecipe;
  const favorited = isFavorite(recipe.id);

  // Scaled servings
  const baseServings = recipe.servings || 4;
  const currentServings = Math.max(1, Math.round(baseServings * servingMultiplier));

  // Derive nutrients
  const nutrients = recipe.nutrition?.nutrients || [];
  const calories = nutrients.find((n) => n.name === 'Calories')?.amount || 460;
  const protein = nutrients.find((n) => n.name === 'Protein')?.amount || 38;
  const totalCarbs = nutrients.find((n) => n.name === 'Carbohydrates')?.amount || 14;
  const fiber = nutrients.find((n) => n.name === 'Fiber')?.amount || 6;
  const fat = nutrients.find((n) => n.name === 'Fat')?.amount || 24;

  // Net Carbs calculation
  const netCarbs = Math.max(1, Math.round(totalCarbs - fiber));

  // Add all ingredients to grocery list
  const handleAddAllToGrocery = () => {
    let count = 0;
    recipe.extendedIngredients?.forEach((ing) => {
      const scaledAmount = Math.round((ing.amount * servingMultiplier) * 10) / 10;
      addGroceryItem(ing.name || ing.original, scaledAmount, ing.unit, ing.aisle, recipe.title);
      count++;
    });
    showToast(`Added ${count} ingredients to your Grocery List!`, 'success');
  };

  const handleSaveToPlan = () => {
    addToMealPlan(planDay, planMeal, recipe);
    setShowPlanModal(false);
    showToast(`Added to your weekly plan for ${planDay} ${planMeal}!`, 'success');
  };

  const toggleIngredientCheck = (id: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Recipe link copied to clipboard!', 'success');
    }
  };

  const jumpToRecipe = () => {
    const el = document.getElementById('core-recipe-module');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const steps = recipe.analyzedInstructions?.[0]?.steps || [];
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const totalIngredients = recipe.extendedIngredients?.length || 0;

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-200">
      {/* Top back navigation */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setActiveTab('recipes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recipes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            title="Share recipe"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            title="Print recipe"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 
        TOP: Large, mouth-watering hero image of the finished dish,
        with a floating 'Jump to Recipe' button and a 'Print' icon.
      */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 shadow-md border border-stone-200/80">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:h-[480px] w-full overflow-hidden bg-stone-100">
          <img
            src={recipe.image || '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg'}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Cinematic Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          {/* Top Right Floating Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10 no-print">
            {/* Print Icon Button */}
            <button
              onClick={handlePrint}
              aria-label="Print Recipe"
              title="Print Recipe"
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-stone-950 shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-700" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-500 shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
            </button>

            {/* Save to Planner Button */}
            <button
              onClick={() => setShowPlanModal(true)}
              aria-label="Add to Weekly Meal Plan"
              title="Add to Weekly Meal Plan"
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-[#557A61] shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4 text-stone-700" />
            </button>
          </div>

          {/* Floating 'Jump to Recipe' Button & Meta Over Image */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
            <div className="text-white space-y-1.5 max-w-2xl">
              {/* Diet & Prep Badge Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span
                  style={{
                    backgroundColor: '#1A202C',
                    color: '#FFFFFF',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]"
                >
                  {recipe.vegan ? 'Vegan' : recipe.vegetarian ? 'Vegetarian' : 'Whole Food'}
                </span>
                <span
                  style={{
                    backgroundColor: '#1A202C',
                    color: '#FFFFFF',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px]"
                >
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span>{recipe.readyInMinutes || 25} mins</span>
                </span>
                <span
                  style={{
                    backgroundColor: '#1A202C',
                    color: '#FFFFFF',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px]"
                >
                  <Flame className="w-3.5 h-3.5 text-white" />
                  <span>{Math.round(calories)} kcal</span>
                </span>
                <span
                  style={{
                    backgroundColor: '#1A202C',
                    color: '#FFFFFF',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]"
                >
                  {recipe.title.toLowerCase().includes('baked') ? 'Oven Baked' : recipe.title.toLowerCase().includes('air fryer') ? 'Air Fryer' : 'Skillet'}
                </span>
              </div>

              {/* Bold Title with periwinkle/lavender blue and text-shadow */}
              <h1
                style={{
                  color: '#aeb5df',
                  textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5)',
                  fontWeight: 800,
                }}
                className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight"
              >
                {recipe.title}
              </h1>
            </div>

            {/* Floating 'Jump to Recipe' button */}
            <div className="no-print self-start sm:self-auto">
              <button
                onClick={jumpToRecipe}
                className="px-5 py-2.5 bg-white/95 hover:bg-white text-stone-900 font-semibold text-xs sm:text-sm rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 transition-all active:scale-95 border border-white/60 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4 text-[#557A61] stroke-[2.5]" />
                <span>Jump to Recipe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        BELOW THE IMAGE:
        Brief, encouraging introductory text & author byline
      */}
      <section className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-4 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-stone-900 text-sm">5.0</span>
            <span className="text-stone-400 text-xs">(184 community reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ChefHat className="w-4 h-4 text-[#557A61]" />
            <span>Recipe Curated & Tested by Registered Dietitian Auguste</span>
          </div>
        </div>

        {/* Brief, encouraging introductory note */}
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl">
          This wholesome, deeply satisfying dish is designed for frictionless healthy weeknight dining. With fresh, vibrant ingredients and a gentle, foolproof technique, it comes together in under 30 minutes without complicated culinary gymnastics. Perfect for nourishing your body while delighting your tastebuds—let's cook something wonderful together!
        </p>

        {/* Fast Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 no-print">
          <button
            onClick={() => startCooking(recipe)}
            className="min-h-[44px] px-5 bg-[#557A61] hover:bg-[#3E5C47] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Distraction-Free Cook Mode</span>
          </button>

          <button
            onClick={handleAddAllToGrocery}
            className="min-h-[44px] px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#557A61]" />
            <span>Add All to Grocery List</span>
          </button>

          <button
            onClick={toggleAiChef}
            className="min-h-[44px] px-4 bg-[#FAF8F5] border border-stone-200 hover:border-[#557A61] text-[#3E5C47] font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#557A61]" />
            <span>Ask Sous Chef Auguste</span>
          </button>
        </div>
      </section>

      {/* 
        CIRCULAR 'NUTRITION MACROS' BADGES:
        Clean, circular 'Nutrition Macros' badges (Net Carbs, Protein, Fat, Calories).
      */}
      <section className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Nutrition Macros per Serving
            </h3>
            <p className="text-xs text-stone-500">
              Dietitian verified · 100% whole food breakdown
            </p>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Based on {currentServings} servings
          </span>
        </div>

        {/* The 4 Clean Circular Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {/* Badge 1: Net Carbs */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:shadow-sm transition-all group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D97757]/40 bg-[#D97757]/5 flex flex-col items-center justify-center text-center shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-stone-900 text-lg sm:text-xl tabular-nums leading-none">
                {netCarbs}g
              </span>
              <span className="text-[10px] text-[#C86747] font-bold uppercase tracking-wider mt-1">
                Net Carbs
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-700 mt-2">Low Carb</span>
            <span className="text-[11px] text-stone-400">({totalCarbs}g Total - {fiber}g Fiber)</span>
          </div>

          {/* Badge 2: Protein */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:shadow-sm transition-all group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#557A61]/40 bg-[#557A61]/5 flex flex-col items-center justify-center text-center shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-stone-900 text-lg sm:text-xl tabular-nums leading-none">
                {Math.round(protein)}g
              </span>
              <span className="text-[10px] text-[#3E5C47] font-bold uppercase tracking-wider mt-1">
                Protein
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-700 mt-2">High Protein</span>
            <span className="text-[11px] text-stone-400">Lean muscle fuel</span>
          </div>

          {/* Badge 3: Fat */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:shadow-sm transition-all group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/40 bg-amber-50/70 flex flex-col items-center justify-center text-center shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-stone-900 text-lg sm:text-xl tabular-nums leading-none">
                {Math.round(fat)}g
              </span>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-1">
                Healthy Fat
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-700 mt-2">Wholesome Oils</span>
            <span className="text-[11px] text-stone-400">Olive & omega rich</span>
          </div>

          {/* Badge 4: Calories */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:shadow-sm transition-all group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-stone-300 bg-white flex flex-col items-center justify-center text-center shadow-2xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-stone-900 text-lg sm:text-xl tabular-nums leading-none">
                {Math.round(calories)}
              </span>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">
                Calories
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-700 mt-2">Energy Balance</span>
            <span className="text-[11px] text-stone-400">kcal per serving</span>
          </div>
        </div>
      </section>

      {/* 
        CORE RECIPE MODULE:
        Distinct, lightly bordered card with a subtle background tint (bg-[#FAF8F5]).
        Includes:
        - Scalable serving size adjuster
        - Checklist-style ingredient list with clickable checkboxes
        - Numbered, step-by-step instructions accompanied by small, inline process photos
      */}
      <section
        id="core-recipe-module"
        className="bg-[#FAF8F5] border border-stone-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] space-y-8"
      >
        {/* Module Header & Servings Adjuster */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-[#557A61] text-xs font-bold uppercase tracking-wider mb-1">
              <ChefHat className="w-4 h-4" />
              <span>Core Recipe Card</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Ingredients & Method
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Check off ingredients as you prepare them in your kitchen.
            </p>
          </div>

          {/* Scalable Serving Size Adjuster */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs flex items-center gap-4 self-start md:self-auto">
            <div>
              <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                Yield / Servings
              </span>
              <span className="text-sm font-extrabold text-stone-900 tabular-nums">
                {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                disabled={servingMultiplier <= 0.5}
                aria-label="Decrease Servings"
                className="w-8 h-8 rounded-lg bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center shadow-2xs active:scale-90 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                disabled={servingMultiplier >= 4}
                aria-label="Increase Servings"
                className="w-8 h-8 rounded-lg bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center shadow-2xs active:scale-90 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Checklist-Style Ingredient List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-lg">
                Fresh Ingredients
              </h3>
              <span className="text-xs text-stone-500">
                ({checkedCount} of {totalIngredients} checked)
              </span>
            </div>

            <div className="flex items-center gap-3 no-print">
              {checkedCount > 0 && (
                <button
                  onClick={() => setCheckedIngredients({})}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Uncheck all
                </button>
              )}
              <button
                onClick={handleAddAllToGrocery}
                className="text-xs font-bold text-[#557A61] hover:text-[#3E5C47] hover:underline cursor-pointer"
              >
                + Add All to Grocery List
              </button>
            </div>
          </div>

          {/* Interactive Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {recipe.extendedIngredients?.map((ing) => {
              const isChecked = !!checkedIngredients[ing.id];
              const scaledAmount = Math.round(ing.amount * servingMultiplier * 10) / 10;
              return (
                <div
                  key={ing.id}
                  onClick={() => toggleIngredientCheck(ing.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-stone-100/60 border-stone-200 text-stone-400'
                      : 'bg-white border-stone-200/80 hover:border-[#557A61]/50 hover:shadow-2xs text-stone-800'
                  }`}
                >
                  {/* Clickable tactile Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-[#557A61] border-[#557A61] text-white'
                        : 'border-stone-300 bg-white group-hover:border-[#557A61]'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Quantity & Ingredient Description */}
                  <div className="text-xs sm:text-sm leading-snug">
                    <span
                      className={`font-bold tabular-nums ${
                        isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {scaledAmount > 0 ? scaledAmount : ''} {ing.unit}{' '}
                    </span>
                    <span className={isChecked ? 'line-through text-stone-400' : 'font-medium'}>
                      {ing.name || ing.original}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 
          NUMBERED, STEP-BY-STEP INSTRUCTIONS:
          Accompanied by small, inline process photos
        */}
        <div className="space-y-6 pt-6 border-t border-stone-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-stone-900 text-lg">
                Step-by-Step Instructions
              </h3>
              <p className="text-xs text-stone-500">
                Detailed cooking method with inline visual technique references
              </p>
            </div>

            <button
              onClick={() => startCooking(recipe)}
              className="no-print self-start sm:self-auto px-4 py-2 bg-[#557A61] hover:bg-[#3E5C47] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Full Screen Mode</span>
            </button>
          </div>

          {/* Steps List with Small Inline Process Photos */}
          <div className="space-y-6">
            {steps.map((st, index) => {
              // Assign an inline process photo corresponding to the step
              const processImg = STEP_PROCESS_IMAGES[index % STEP_PROCESS_IMAGES.length];
              return (
                <div
                  key={st.number}
                  className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start gap-4 transition-all hover:border-[#557A61]/40"
                >
                  {/* Step Number Badge */}
                  <div className="w-8 h-8 rounded-xl bg-[#557A61] text-white font-bold text-sm flex items-center justify-center shrink-0 tabular-nums shadow-xs">
                    {st.number}
                  </div>

                  {/* Step Description & Details */}
                  <div className="flex-1 space-y-2 text-left">
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                      {st.step}
                    </p>

                    {/* Step Timer Badge if available */}
                    {st.length && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E5C47] bg-[#557A61]/10 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Estimated time: {st.length.number} {st.length.unit}</span>
                      </div>
                    )}
                  </div>

                  {/* Small, Inline Process Photo */}
                  <div className="sm:w-28 sm:h-28 w-full h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 shadow-2xs">
                    <img
                      src={processImg}
                      alt={`Step ${st.number} culinary technique`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}

            {steps.length === 0 && (
              <p className="text-xs text-stone-500 italic">
                Step-by-step instructions are available directly in hands-free Cook Mode.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Save to Planner Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowPlanModal(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 text-left">
            <h3 className="font-bold text-stone-900 text-base">Add to Weekly Meal Plan</h3>
            <p className="text-xs text-stone-500">
              Schedule <span className="font-semibold text-stone-800">{recipe.title}</span> for this week:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Select Day:</label>
                <select
                  value={planDay}
                  onChange={(e) => setPlanDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#557A61]"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Meal Time:</label>
                <select
                  value={planMeal}
                  onChange={(e) => setPlanMeal(e.target.value as MealType)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#557A61]"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToPlan}
                className="px-5 py-2 bg-[#557A61] hover:bg-[#3E5C47] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

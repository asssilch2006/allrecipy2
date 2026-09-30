import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Utensils,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
  ChefHat,
  Search,
  Plus,
  Check,
  Clock,
  Flame,
  Leaf,
  Mail,
  Dumbbell,
  Droplets,
  Heart,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecipeCard } from '../RecipeCard';
import { getRandomRecipes, findByIngredients } from '../../services/api';
import { RecipeDetail, RecipeSummary } from '../../types';

// Curated 10-ingredient-or-less healthy recipes for instant loading and fallback
const CURATED_HEALTHY_RECIPES: Array<Partial<RecipeDetail> & { dietBadge: string; rating: number; reviewsCount: number }> = [
  {
    id: 649931,
    title: 'Pan-Seared Citrus Herb Salmon with Asparagus & Garlic Butter',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    servings: 2,
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 184,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    diets: ['keto', 'gluten free', 'pescatarian', 'high protein'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 460, unit: 'kcal' },
        { name: 'Protein', amount: 38, unit: 'g' },
        { name: 'Fat', amount: 32, unit: 'g' },
      ],
    },
  },
  {
    id: 715538,
    title: 'Vibrant Mediterranean Quinoa & Roasted Chickpea Nourish Bowl',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 25,
    servings: 2,
    dietBadge: 'Vegan',
    rating: 4.9,
    reviewsCount: 312,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    diets: ['vegan', 'gluten free', 'dairy free', 'high protein', 'clean eating'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 520, unit: 'kcal' },
        { name: 'Protein', amount: 19, unit: 'g' },
        { name: 'Fat', amount: 22, unit: 'g' },
      ],
    },
  },
  {
    id: 716429,
    title: 'Pasta with Garlic, Scallions, Cauliflower & Herbed Breadcrumbs',
    image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
    readyInMinutes: 25,
    servings: 4,
    dietBadge: 'Vegan',
    rating: 4.9,
    reviewsCount: 228,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    diets: ['vegetarian', '30-minute meals'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 485, unit: 'kcal' },
        { name: 'Protein', amount: 16, unit: 'g' },
        { name: 'Fat', amount: 14, unit: 'g' },
      ],
    },
  },
  {
    id: 800101,
    title: 'Avocado Cobb Salad with Soft-Boiled Eggs & Herb Chicken',
    image: '/src/assets/images/recipe_avocado_keto_salad_1790308634626.jpg',
    readyInMinutes: 15,
    servings: 2,
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 195,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    diets: ['keto', 'high protein', 'gluten free', '30-minute meals'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 430, unit: 'kcal' },
        { name: 'Protein', amount: 34, unit: 'g' },
        { name: 'Fat', amount: 29, unit: 'g' },
      ],
    },
  },
  {
    id: 632660,
    title: 'Artisan Shakshuka with Poached Farm Eggs, Feta & Herbs',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 20,
    servings: 3,
    dietBadge: 'Vegetarian',
    rating: 4.8,
    reviewsCount: 146,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    diets: ['vegetarian', 'keto', '30-minute meals'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 340, unit: 'kcal' },
        { name: 'Protein', amount: 18, unit: 'g' },
        { name: 'Fat', amount: 22, unit: 'g' },
      ],
    },
  },
  {
    id: 800102,
    title: 'Golden Coconut Ginger Curry with Crispy Tofu & Lime',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 25,
    servings: 3,
    dietBadge: 'Dairy-Free',
    rating: 4.9,
    reviewsCount: 178,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    diets: ['dairy free', 'vegan', '30-minute meals', 'high protein'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 390, unit: 'kcal' },
        { name: 'Protein', amount: 21, unit: 'g' },
        { name: 'Fat', amount: 18, unit: 'g' },
      ],
    },
  },
];

type CategoryFilter = 'all' | 'keto' | '30-min' | 'high-protein' | 'dairy-free';

export const HomeView: React.FC = () => {
  const { setActiveTab, openRecipeDetails, showToast, groceryList } = useApp();
  const [recipes, setRecipes] = useState<RecipeDetail[]>(CURATED_HEALTHY_RECIPES as any);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  // Email capture state
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fridge search quick widget
  const [pantryInput, setPantryInput] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState<string[]>(['garlic', 'tomatoes', 'olive oil']);
  const [fridgeResults, setFridgeResults] = useState<RecipeSummary[]>([]);
  const [searchingFridge, setSearchingFridge] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMoreRecipes() {
      try {
        const data = await getRandomRecipes(6);
        if (isMounted && data.recipes && data.recipes.length > 0) {
          // Merge API recipes with curated list while prioritizing curated quality images
          const combined = [
            ...CURATED_HEALTHY_RECIPES,
            ...data.recipes.filter(
              (r) => !CURATED_HEALTHY_RECIPES.some((c) => c.id === r.id)
            ),
          ];
          setRecipes(combined as any);
        }
      } catch (err) {
        // Fallback already pre-loaded
        console.warn('Using curated healthy recipes:', err);
      }
    }
    loadMoreRecipes();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      showToast('Please enter a valid email address', 'info');
      return;
    }
    setIsSubscribed(true);
    showToast('🎉 Welcome! Your 10-Ingredient Starter Pack is on its way.', 'success');
  };

  const addPantryTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = pantryInput.trim();
    if (trimmed && !pantryIngredients.includes(trimmed.toLowerCase())) {
      setPantryIngredients([...pantryIngredients, trimmed.toLowerCase()]);
      setPantryInput('');
    }
  };

  const removePantryTag = (ing: string) => {
    setPantryIngredients(pantryIngredients.filter((i) => i !== ing));
  };

  const handleSearchByFridge = async () => {
    if (pantryIngredients.length === 0) {
      showToast('Add at least one ingredient from your kitchen', 'info');
      return;
    }
    setSearchingFridge(true);
    try {
      const results = await findByIngredients({
        ingredients: pantryIngredients,
        number: 6,
        ranking: 1,
      });
      setFridgeResults(results);
      showToast(`Found ${results.length} recipes with your ingredients!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not search recipes right now', 'info');
    } finally {
      setSearchingFridge(false);
    }
  };

  // Filter recipes based on the active category pill
  const filteredRecipes = recipes.filter((recipe) => {
    if (selectedCategory === 'all') return true;
    const diets = (recipe.diets || []).map((d) => d.toLowerCase());
    const title = recipe.title.toLowerCase();
    const badge = ((recipe as any).dietBadge || '').toLowerCase();

    if (selectedCategory === 'keto') {
      return (
        diets.some((d) => d.includes('keto')) ||
        badge === 'keto' ||
        title.includes('salmon') ||
        title.includes('avocado') ||
        title.includes('cobb')
      );
    }
    if (selectedCategory === '30-min') {
      return (recipe.readyInMinutes || 30) <= 30;
    }
    if (selectedCategory === 'high-protein') {
      const protein =
        recipe.nutrition?.nutrients?.find((n) => n.name === 'Protein')?.amount || 0;
      return (
        protein >= 18 ||
        diets.some((d) => d.includes('protein')) ||
        title.includes('salmon') ||
        title.includes('chicken') ||
        title.includes('quinoa') ||
        title.includes('tofu')
      );
    }
    if (selectedCategory === 'dairy-free') {
      return (
        recipe.dairyFree ||
        badge === 'dairy-free' ||
        diets.some((d) => d.includes('dairy free') || d.includes('vegan')) ||
        recipe.vegan
      );
    }
    return true;
  });

  return (
    <div className="space-y-10 md:space-y-14 pb-16 animate-in fade-in duration-300">
      {/* 
        HERO SECTION:
        Features an overhead photograph of a vibrant, fresh meal on a light wood table,
        overlaid with bold, friendly typography: 'Easy, Healthy Recipes. 10 Ingredients Or Less.'
        Below the headline, a clean email capture form with a 'Sign Up' button.
      */}
      <section className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200/80 min-h-[460px] md:min-h-[520px] flex items-center">
        {/* Overhead fresh meal photograph */}
        <img
          src="/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg"
          alt="Overhead flat-lay photograph of a vibrant, fresh healthy meal on a light wood table"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle warm scrim for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/60 to-stone-900/30 md:from-stone-900/75 md:via-stone-900/40 md:to-transparent" />

        {/* Hero Overlay Content Card */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl text-left">
          {/* Subtle Sage Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-200 border border-white/20 mb-4 tracking-wide uppercase">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Wholesome Kitchen · Real Ingredients</span>
          </div>

          {/* Bold, Friendly Typography */}
          <h1
            style={{ color: '#cbd9e6' }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-4 text-balance drop-shadow-xs"
          >
            Easy, Healthy Recipes.{' '}
            <span style={{ color: '#d7eeee' }} className="font-normal italic">
              10 Ingredients Or Less.
            </span>
          </h1>

          <p
            style={{ borderColor: '#1b2735', color: '#e2eaff' }}
            className="text-sm sm:text-base leading-relaxed mb-6 font-normal max-w-xl"
          >
            Discover vibrant, dietitian-inspired meals made with whole foods and zero fuss. Simple prep, balanced macros, and 100% free open access.
          </p>

          {/* Clean Email Capture Form */}
          {!isSubscribed ? (
            <form onSubmit={handleEmailSubmit} className="space-y-2 max-w-lg">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/40">
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1 text-stone-800">
                  <Mail className="w-5 h-5 text-[#557A61]" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email for free weekly recipes..."
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[46px] px-6 py-2.5 bg-[#D97757] hover:bg-[#C86747] active:bg-[#B7573A] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p style={{ color: '#ffffff' }} className="text-[11px] pl-1 font-medium">
                Join 45,000+ healthy home cooks. Free 10-ingredient meal guide sent instantly. No spam.
              </p>
            </form>
          ) : (
            <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-300/60 shadow-lg text-stone-800 max-w-md animate-in fade-in">
              <div className="flex items-center gap-2 text-[#557A61] font-bold text-sm mb-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>You're Subscribed!</span>
              </div>
              <p className="text-xs text-stone-600">
                We've sent our exclusive <strong>10-Ingredient Healthy Starter Pack</strong> straight to your inbox. Happy cooking!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 
        CATEGORY PILLS:
        A row of rounded, icon-driven category pills:
        (Keto, 30-Minute Meals, High Protein, Dairy-Free)
      */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Browse By Lifestyle & Prep
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Showing {filteredRecipes.length} healthy dishes
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {/* All Recipes Pill */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#557A61] text-white border-[#557A61] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#557A61]/50 hover:bg-[#FAF8F5]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>All Healthy Recipes</span>
          </button>

          {/* Keto Pill */}
          <button
            onClick={() => setSelectedCategory('keto')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategory === 'keto'
                ? 'bg-[#D97757] text-white border-[#D97757] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#D97757]/50 hover:bg-[#FAF8F5]'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Keto</span>
          </button>

          {/* 30-Minute Meals Pill */}
          <button
            onClick={() => setSelectedCategory('30-min')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategory === '30-min'
                ? 'bg-[#557A61] text-white border-[#557A61] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#557A61]/50 hover:bg-[#FAF8F5]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#557A61]" />
            <span>30-Minute Meals</span>
          </button>

          {/* High Protein Pill */}
          <button
            onClick={() => setSelectedCategory('high-protein')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategory === 'high-protein'
                ? 'bg-[#557A61] text-white border-[#557A61] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#557A61]/50 hover:bg-[#FAF8F5]'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-emerald-600" />
            <span>High Protein</span>
          </button>

          {/* Dairy-Free Pill */}
          <button
            onClick={() => setSelectedCategory('dairy-free')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              selectedCategory === 'dairy-free'
                ? 'bg-[#557A61] text-white border-[#557A61] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#557A61]/50 hover:bg-[#FAF8F5]'
            }`}
          >
            <Droplets className="w-4 h-4 text-teal-600" />
            <span>Dairy-Free</span>
          </button>
        </div>
      </section>

      {/* 
        MAIN CONTENT AREA:
        Responsive 3-column grid of recipe cards.
        Each card has a high-res food image, bold recipe title, 5-star rating,
        prep time, and a small 'Keto' or 'Vegan' dietary badge.
        Abundant white space, soft shadows, and warm beige, sage green, and soft terracotta accents.
      */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Featured Clean Recipes
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Tested by registered dietitians · 10 whole ingredients or less · Maximum 30 minutes
            </p>
          </div>

          <button
            onClick={() => setActiveTab('recipes')}
            className="text-xs font-semibold text-[#557A61] hover:text-[#3E5C47] flex items-center gap-1.5 hover:underline self-start sm:self-auto"
          >
            <span>Explore all 300,000+ recipes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              dietBadge={(recipe as any).dietBadge}
              rating={(recipe as any).rating}
              reviewsCount={(recipe as any).reviewsCount}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-semibold text-stone-800 text-sm">No recipes found for this filter</h3>
            <p className="text-xs text-stone-500">
              Try switching back to All Recipes or explore our full recipe directory.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-[#557A61] text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Quick Cooking Hub Shortcuts */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <button
          onClick={() => setActiveTab('recipes')}
          className="p-5 bg-white border border-stone-200/80 rounded-2xl text-left hover:border-[#557A61]/50 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#557A61] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Recipe Library</h3>
          <p className="text-xs text-stone-500 mt-1">Search 300k+ meals with custom nutrition filters</p>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className="p-5 bg-white border border-stone-200/80 rounded-2xl text-left hover:border-[#557A61]/50 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Weekly Planner</h3>
          <p className="text-xs text-stone-500 mt-1">Drag & organize breakfast, lunch & dinner</p>
        </button>

        <button
          onClick={() => setActiveTab('grocery')}
          className="p-5 bg-white border border-stone-200/80 rounded-2xl text-left hover:border-[#557A61]/50 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Smart Grocery</h3>
            {groceryList.length > 0 && (
              <span className="text-[11px] font-bold text-[#557A61] tabular-nums bg-emerald-50 px-2 py-0.5 rounded-full">
                {groceryList.filter((i) => !i.checked).length} items
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">Aisle-by-aisle checklist with one-tap export</p>
        </button>

        <button
          onClick={() => {
            if (recipes[0]) {
              openRecipeDetails(recipes[0].id);
            } else {
              setActiveTab('recipes');
            }
          }}
          className="p-5 bg-white border border-stone-200/80 rounded-2xl text-left hover:border-[#557A61]/50 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D97757] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Hands-Free Cook</h3>
          <p className="text-xs text-stone-500 mt-1">Step-by-step guidance with timers & voice</p>
        </button>
      </section>

      {/* "What's In Your Fridge?" Interactive Engine (POST /api/spoon/find-by-ingredients) */}
      <section className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F2EB] border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[#557A61] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#557A61]" />
              <span>Zero-Waste Kitchen Matcher</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
              Cook with what is in your fridge
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Enter ingredients you have on hand to uncover healthy meals without an extra grocery run.
            </p>
          </div>

          <button
            onClick={handleSearchByFridge}
            disabled={searchingFridge}
            className="min-h-[44px] px-5 py-2.5 bg-[#557A61] hover:bg-[#3E5C47] active:bg-[#2D4534] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:bg-stone-300 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{searchingFridge ? 'Matching Recipes...' : 'Match My Fridge'}</span>
          </button>
        </div>

        {/* Input & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs flex-1 min-w-[200px] shadow-2xs">
            <Plus className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={pantryInput}
              onChange={(e) => setPantryInput(e.target.value)}
              onKeyDown={addPantryTag}
              placeholder="Type an ingredient (e.g. avocado, spinach, eggs, salmon) and press Enter..."
              className="w-full bg-transparent focus:outline-none text-stone-800 placeholder:text-stone-400"
            />
          </div>
          <button
            onClick={addPantryTag}
            className="min-h-[40px] px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* Active tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-stone-500 mr-1 font-medium">Your Ingredients:</span>
          {pantryIngredients.map((ing) => (
            <button
              key={ing}
              onClick={() => removePantryTag(ing)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100/70 hover:bg-rose-100 text-emerald-900 hover:text-rose-900 text-xs font-medium transition-colors cursor-pointer"
              title="Click to remove"
            >
              <span>{ing}</span>
              <span className="text-stone-400 hover:text-rose-600 ml-0.5">×</span>
            </button>
          ))}
          {pantryIngredients.length === 0 && (
            <span className="text-xs text-stone-400 italic">No ingredients added yet</span>
          )}
        </div>

        {/* Fridge Search Results */}
        {fridgeResults.length > 0 && (
          <div className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-stone-900 text-sm">
                Matched Recipes ({fridgeResults.length})
              </h4>
              <span className="text-xs text-stone-500">Sorted by best ingredient match</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fridgeResults.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chef's Daily Technique Card */}
      <section
        style={{ backgroundColor: '#8d9a5e' }}
        className="text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#557A61]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ChefHat className="w-4 h-4" />
            <span>Chef Auguste's Daily Technique</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            The Golden Rule of Searing Wild Salmon
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Whenever searing salmon, steak, or tofu, pat the surface bone-dry with a clean paper towel and ensure your skillet is shimmering hot before introducing the oil. Never move the protein for the first 4 full minutes—the Maillard crust will release itself effortlessly once caramelized.
          </p>
          <button
            onClick={() => setActiveTab('recipes')}
            className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Browse recipes applying this technique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

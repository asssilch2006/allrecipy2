import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Clock,
  Sparkles,
  Utensils,
  Check,
  Star,
  ArrowUpDown,
} from 'lucide-react';
import { RecipeCard } from '../RecipeCard';
import { RecipeSummary } from '../../types';
import { useApp } from '../../context/AppContext';

// Comprehensive dataset with full tags for Course, Ingredients, Cooking Method, and Diet
interface TaggedRecipe extends RecipeSummary {
  course: ('breakfast' | 'dinner' | 'lunch')[];
  keyIngredients: string[];
  method: ('air fryer' | 'one pan' | 'sheet pan' | 'stovetop')[];
  dietsList: ('keto' | 'paleo' | 'nut-free' | 'vegan' | 'gluten-free' | 'dairy-free')[];
  rating: number;
  reviewsCount: number;
  dietBadge: string;
  dairyFree?: boolean;
}

const CATALOG_RECIPES: TaggedRecipe[] = [
  {
    id: 649931,
    title: 'One-Pan Citrus Herb Wild Salmon with Charred Asparagus',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    calories: 460,
    course: ['dinner'],
    keyIngredients: ['salmon', 'asparagus', 'lemon', 'garlic'],
    method: ['one pan', 'stovetop'],
    dietsList: ['keto', 'paleo', 'nut-free', 'gluten-free'],
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 184,
    dairyFree: false,
    glutenFree: true,
  },
  {
    id: 800101,
    title: 'Avocado Cobb Salad with Jammy Eggs & Herb Grilled Chicken',
    image: '/src/assets/images/recipe_avocado_keto_salad_1790308634626.jpg',
    readyInMinutes: 15,
    calories: 430,
    course: ['lunch', 'dinner'],
    keyIngredients: ['chicken', 'avocado', 'eggs', 'spinach'],
    method: ['stovetop', 'one pan'],
    dietsList: ['keto', 'paleo', 'nut-free', 'gluten-free'],
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 195,
    glutenFree: true,
  },
  {
    id: 800103,
    title: 'Crispy Air Fryer Herb Chicken Thighs with Garlic & Rosemary',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 22,
    calories: 410,
    course: ['dinner'],
    keyIngredients: ['chicken', 'garlic', 'rosemary', 'olive oil'],
    method: ['air fryer'],
    dietsList: ['keto', 'paleo', 'nut-free', 'gluten-free', 'dairy-free'],
    dietBadge: 'Keto',
    rating: 4.9,
    reviewsCount: 240,
    dairyFree: true,
    glutenFree: true,
  },
  {
    id: 632660,
    title: 'One-Pan Artisan Shakshuka with Poached Farm Eggs & Feta',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 20,
    calories: 320,
    course: ['breakfast', 'dinner'],
    keyIngredients: ['eggs', 'tomatoes', 'peppers', 'feta'],
    method: ['one pan', 'stovetop'],
    dietsList: ['nut-free', 'gluten-free', 'keto'],
    dietBadge: 'Vegetarian',
    rating: 4.9,
    reviewsCount: 310,
    vegetarian: true,
    glutenFree: true,
  },
  {
    id: 800104,
    title: 'Fluffy Almond Flour Pancakes with Fresh Berry Compote',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 18,
    calories: 360,
    course: ['breakfast'],
    keyIngredients: ['almond flour', 'eggs', 'berries', 'cinnamon'],
    method: ['stovetop', 'one pan'],
    dietsList: ['keto', 'paleo', 'gluten-free', 'dairy-free'],
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 220,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 715538,
    title: 'Vibrant Mediterranean Quinoa & Roasted Chickpea Nourish Bowl',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 25,
    calories: 520,
    course: ['lunch', 'dinner'],
    keyIngredients: ['chickpeas', 'avocado', 'quinoa', 'tahini'],
    method: ['sheet pan', 'one pan'],
    dietsList: ['vegan', 'nut-free', 'gluten-free', 'dairy-free'],
    dietBadge: 'Vegan',
    rating: 4.9,
    reviewsCount: 312,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 716429,
    title: 'Pasta with Garlic, Scallions, Cauliflower & Herbed Breadcrumbs',
    image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
    readyInMinutes: 25,
    calories: 485,
    course: ['dinner'],
    keyIngredients: ['cauliflower', 'garlic', 'pasta', 'olive oil'],
    method: ['stovetop', 'one pan'],
    dietsList: ['nut-free', 'vegan'],
    dietBadge: 'Vegan',
    rating: 4.9,
    reviewsCount: 228,
    vegetarian: true,
  },
  {
    id: 800105,
    title: 'Air Fryer Almond-Crusted Chicken Cutlets with Lemon Dijon Dip',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    calories: 395,
    course: ['dinner', 'lunch'],
    keyIngredients: ['almond flour', 'chicken', 'dijon', 'garlic'],
    method: ['air fryer'],
    dietsList: ['keto', 'paleo', 'gluten-free', 'dairy-free'],
    dietBadge: 'Keto',
    rating: 4.9,
    reviewsCount: 165,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 800102,
    title: 'One-Pan Golden Coconut Curry with Crispy Tofu & Fresh Lime',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 25,
    calories: 390,
    course: ['dinner'],
    keyIngredients: ['tofu', 'coconut milk', 'ginger', 'lime'],
    method: ['one pan', 'stovetop'],
    dietsList: ['vegan', 'nut-free', 'gluten-free', 'dairy-free'],
    dietBadge: 'Dairy-Free',
    rating: 4.9,
    reviewsCount: 178,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 800106,
    title: 'Air Fryer Herb-Roasted Salmon Bites with Cucumber Dill Sauce',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 14,
    calories: 380,
    course: ['dinner', 'lunch'],
    keyIngredients: ['salmon', 'dill', 'lemon', 'cucumber'],
    method: ['air fryer'],
    dietsList: ['keto', 'paleo', 'nut-free', 'gluten-free'],
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 142,
    glutenFree: true,
  },
  {
    id: 800107,
    title: 'Keto Almond Flour Herbed Breakfast Biscuits with Poached Egg',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 22,
    calories: 310,
    course: ['breakfast'],
    keyIngredients: ['almond flour', 'eggs', 'chives', 'butter'],
    method: ['sheet pan', 'one pan'],
    dietsList: ['keto', 'gluten-free'],
    dietBadge: 'Keto',
    rating: 4.8,
    reviewsCount: 116,
    glutenFree: true,
  },
  {
    id: 800108,
    title: 'One-Pan Lemon Garlic Chicken Skillet with Baby Spinach',
    image: '/src/assets/images/recipe_avocado_keto_salad_1790308634626.jpg',
    readyInMinutes: 20,
    calories: 420,
    course: ['dinner'],
    keyIngredients: ['chicken', 'spinach', 'garlic', 'lemon'],
    method: ['one pan', 'stovetop'],
    dietsList: ['keto', 'paleo', 'nut-free', 'gluten-free', 'dairy-free'],
    dietBadge: 'Keto',
    rating: 4.9,
    reviewsCount: 205,
    glutenFree: true,
    dairyFree: true,
  },
];

type SortOption = 'popular' | 'rating' | 'time-asc' | 'calories-asc' | 'title-asc';

export const RecipesView: React.FC = () => {
  const { showToast } = useApp();

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Active filter state sets
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [under30Min, setUnder30Min] = useState<boolean>(false);

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Accordion open/close state
  const [accordionState, setAccordionState] = useState({
    course: true,
    ingredient: true,
    method: true,
    diet: true,
    prepTime: true,
  });

  // Mobile sidebar drawer open/close
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleAccordion = (key: keyof typeof accordionState) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (list.includes(val)) {
      setList(list.filter((item) => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCourses([]);
    setSelectedIngredients([]);
    setSelectedMethods([]);
    setSelectedDiets([]);
    setUnder30Min(false);
    setSearchQuery('');
    showToast('All filters cleared', 'info');
  };

  // Compile active tags list for the chips row
  const activeTags = useMemo(() => {
    const tags: Array<{ id: string; label: string; onRemove: () => void }> = [];

    if (searchQuery.trim()) {
      tags.push({
        id: `query-${searchQuery}`,
        label: `"${searchQuery}"`,
        onRemove: () => setSearchQuery(''),
      });
    }

    if (under30Min) {
      tags.push({
        id: 'time-under30',
        label: 'Under 30 Min',
        onRemove: () => setUnder30Min(false),
      });
    }

    selectedCourses.forEach((c) => {
      tags.push({
        id: `course-${c}`,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        onRemove: () => setSelectedCourses((prev) => prev.filter((item) => item !== c)),
      });
    });

    selectedIngredients.forEach((ing) => {
      const displayMap: Record<string, string> = {
        'almond flour': 'Almond Flour',
        chicken: 'Chicken',
        salmon: 'Salmon',
        avocado: 'Avocado',
      };
      tags.push({
        id: `ing-${ing}`,
        label: displayMap[ing] || ing,
        onRemove: () => setSelectedIngredients((prev) => prev.filter((item) => item !== ing)),
      });
    });

    selectedMethods.forEach((m) => {
      const displayMap: Record<string, string> = {
        'air fryer': 'Air Fryer',
        'one pan': 'One Pan',
        'sheet pan': 'Sheet Pan',
        stovetop: 'Stovetop',
      };
      tags.push({
        id: `method-${m}`,
        label: displayMap[m] || m,
        onRemove: () => setSelectedMethods((prev) => prev.filter((item) => item !== m)),
      });
    });

    selectedDiets.forEach((d) => {
      const displayMap: Record<string, string> = {
        keto: 'Keto',
        paleo: 'Paleo',
        'nut-free': 'Nut-Free',
        vegan: 'Vegan',
        'gluten-free': 'Gluten-Free',
      };
      tags.push({
        id: `diet-${d}`,
        label: displayMap[d] || d,
        onRemove: () => setSelectedDiets((prev) => prev.filter((item) => item !== d)),
      });
    });

    return tags;
  }, [searchQuery, under30Min, selectedCourses, selectedIngredients, selectedMethods, selectedDiets]);

  // Filter and sort the recipe dataset
  const filteredRecipes = useMemo(() => {
    return CATALOG_RECIPES.filter((r) => {
      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchIng = r.keyIngredients.some((i) => i.toLowerCase().includes(query));
        if (!matchTitle && !matchIng) return false;
      }

      // Course filter
      if (selectedCourses.length > 0) {
        const matchesCourse = selectedCourses.some((c) => r.course.includes(c as any));
        if (!matchesCourse) return false;
      }

      // Ingredient filter
      if (selectedIngredients.length > 0) {
        const matchesIngredient = selectedIngredients.every((ing) =>
          r.keyIngredients.some((k) => k.toLowerCase().includes(ing.toLowerCase()))
        );
        if (!matchesIngredient) return false;
      }

      // Method filter
      if (selectedMethods.length > 0) {
        const matchesMethod = selectedMethods.some((m) => r.method.includes(m as any));
        if (!matchesMethod) return false;
      }

      // Diet filter
      if (selectedDiets.length > 0) {
        const matchesDiet = selectedDiets.every((d) => r.dietsList.includes(d as any));
        if (!matchesDiet) return false;
      }

      // Under 30 min
      if (under30Min && (r.readyInMinutes || 30) > 30) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
        case 'time-asc':
          return (a.readyInMinutes || 30) - (b.readyInMinutes || 30);
        case 'calories-asc':
          return (Number(a.calories) || 500) - (Number(b.calories) || 500);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'popular':
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }, [searchQuery, selectedCourses, selectedIngredients, selectedMethods, selectedDiets, under30Min, sortBy]);

  // Sidebar Filter Content component
  const FilterSidebarContent = (
    <div className="space-y-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#557A61]" />
          <h3 className="font-bold text-stone-900 text-sm tracking-tight">Filter Recipes</h3>
        </div>
        {activeTags.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#D97757] hover:text-[#C86747] hover:underline cursor-pointer"
          >
            Clear all ({activeTags.length})
          </button>
        )}
      </div>

      {/* Accordion 1: By Course */}
      <div className="border-b border-stone-200/80 pb-3">
        <button
          onClick={() => toggleAccordion('course')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-stone-800 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>By Course</span>
            {selectedCourses.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#557A61] text-white text-[10px] flex items-center justify-center font-bold">
                {selectedCourses.length}
              </span>
            )}
          </div>
          {accordionState.course ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </button>

        {accordionState.course && (
          <div className="mt-2 space-y-1">
            {[
              { id: 'breakfast', label: 'Breakfast', count: 3 },
              { id: 'dinner', label: 'Dinner', count: 8 },
              { id: 'lunch', label: 'Lunch & Bowls', count: 4 },
            ].map((item) => {
              const checked = selectedCourses.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilter(selectedCourses, setSelectedCourses, item.id)}
                      className="w-4 h-4 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-stone-900' : 'font-normal'}>{item.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">({item.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: By Ingredient */}
      <div className="border-b border-stone-200/80 pb-3">
        <button
          onClick={() => toggleAccordion('ingredient')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-stone-800 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>By Ingredient</span>
            {selectedIngredients.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#557A61] text-white text-[10px] flex items-center justify-center font-bold">
                {selectedIngredients.length}
              </span>
            )}
          </div>
          {accordionState.ingredient ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </button>

        {accordionState.ingredient && (
          <div className="mt-2 space-y-1">
            {[
              { id: 'almond flour', label: 'Almond Flour', count: 3 },
              { id: 'chicken', label: 'Chicken', count: 4 },
              { id: 'salmon', label: 'Salmon', count: 3 },
              { id: 'avocado', label: 'Avocado', count: 2 },
            ].map((item) => {
              const checked = selectedIngredients.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilter(selectedIngredients, setSelectedIngredients, item.id)}
                      className="w-4 h-4 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-stone-900' : 'font-normal'}>{item.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">({item.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 3: By Method */}
      <div className="border-b border-stone-200/80 pb-3">
        <button
          onClick={() => toggleAccordion('method')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-stone-800 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>By Method</span>
            {selectedMethods.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#557A61] text-white text-[10px] flex items-center justify-center font-bold">
                {selectedMethods.length}
              </span>
            )}
          </div>
          {accordionState.method ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </button>

        {accordionState.method && (
          <div className="mt-2 space-y-1">
            {[
              { id: 'air fryer', label: 'Air Fryer', count: 3 },
              { id: 'one pan', label: 'One Pan', count: 7 },
              { id: 'stovetop', label: 'Stovetop', count: 6 },
              { id: 'sheet pan', label: 'Sheet Pan', count: 2 },
            ].map((item) => {
              const checked = selectedMethods.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilter(selectedMethods, setSelectedMethods, item.id)}
                      className="w-4 h-4 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-stone-900' : 'font-normal'}>{item.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">({item.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 4: By Diet */}
      <div className="border-b border-stone-200/80 pb-3">
        <button
          onClick={() => toggleAccordion('diet')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-stone-800 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>By Diet</span>
            {selectedDiets.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#557A61] text-white text-[10px] flex items-center justify-center font-bold">
                {selectedDiets.length}
              </span>
            )}
          </div>
          {accordionState.diet ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </button>

        {accordionState.diet && (
          <div className="mt-2 space-y-1">
            {[
              { id: 'keto', label: 'Keto', count: 7 },
              { id: 'paleo', label: 'Paleo', count: 5 },
              { id: 'nut-free', label: 'Nut-Free', count: 6 },
              { id: 'vegan', label: 'Vegan', count: 2 },
              { id: 'gluten-free', label: 'Gluten-Free', count: 10 },
            ].map((item) => {
              const checked = selectedDiets.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilter(selectedDiets, setSelectedDiets, item.id)}
                      className="w-4 h-4 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-stone-900' : 'font-normal'}>{item.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">({item.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 5: Prep Time Quick Toggle */}
      <div>
        <button
          onClick={() => toggleAccordion('prepTime')}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-stone-800 hover:text-[#557A61] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span>Prep Time</span>
            {under30Min && (
              <span className="w-4 h-4 rounded-full bg-[#557A61] text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            )}
          </div>
          {accordionState.prepTime ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </button>

        {accordionState.prepTime && (
          <div className="mt-2 space-y-1">
            <label className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200/60 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={under30Min}
                  onChange={(e) => setUnder30Min(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#557A61] focus:ring-[#557A61] accent-[#557A61] cursor-pointer"
                />
                <span className={under30Min ? 'font-semibold text-stone-900' : 'font-normal'}>Under 30 Min</span>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">(11)</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Recipe Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Organized clean recipes filtered by course, pantry ingredients, cooking method, and diet.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden self-start min-h-[42px] px-4 py-2 bg-stone-100 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#557A61]" />
          <span>Filters</span>
          {activeTags.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#557A61] text-white text-[10px] font-bold">
              {activeTags.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Dual-Column Layout: Left Gray Sidebar + Right White Grid Area */}
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        {/* 
          LEFT SIDEBAR:
          Light gray background separating it from the crisp white content area.
          Features accordion-style filtering with clean checkboxes and subtle hover states.
        */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 bg-stone-100/90 border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
          {FilterSidebarContent}
        </aside>

        {/* Mobile Slide-Out or Collapsible Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden w-full bg-stone-100 border border-stone-200 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-3">
              <span className="font-bold text-sm text-stone-900">Filter Recipes</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterSidebarContent}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-4 w-full py-2.5 bg-[#557A61] text-white rounded-xl font-semibold text-xs text-center cursor-pointer"
            >
              Show {filteredRecipes.length} Results
            </button>
          </div>
        )}

        {/* 
          MAIN RIGHT AREA:
          Displays a dense but breathable uniform grid of recipe cards.
          Top features Sort By dropdown and active filter tags with easy clear all functionality.
        */}
        <main className="flex-1 w-full bg-white rounded-2xl md:rounded-3xl border border-stone-200/80 p-5 sm:p-6 lg:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          {/* Top Control Bar: Search + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, ingredient or recipe name..."
                className="w-full pl-10 pr-9 py-2 bg-stone-50/80 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#557A61] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Result Count & 'Sort By' Dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-stone-500 font-medium">
                <strong className="text-stone-900 font-bold">{filteredRecipes.length}</strong> recipes
              </span>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 text-[11px] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated (★ 5.0)</option>
                  <option value="time-asc">Prep Time: Quickest</option>
                  <option value="calories-asc">Calories: Low to High</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags Row with Easy 'Clear All' */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 animate-in fade-in duration-200">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
                Active:
              </span>
              {activeTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#557A61]/10 text-[#3E5C47] border border-[#557A61]/20 text-xs font-semibold shadow-2xs group transition-colors"
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={tag.onRemove}
                    aria-label={`Remove filter ${tag.label}`}
                    className="text-stone-400 hover:text-rose-600 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </span>
              ))}

              {/* Easy 'Clear All' button */}
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#D97757] hover:text-[#C86747] hover:underline px-2 py-1 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* 
            Dense but Breathable Uniform Grid of Recipe Cards
          */}
          <div className="mt-6">
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    dietBadge={recipe.dietBadge}
                    rating={recipe.rating}
                    reviewsCount={recipe.reviewsCount}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-stone-50/70 border border-stone-200/80 rounded-2xl p-8 space-y-4 max-w-md mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-stone-400" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-sm">No recipes match your criteria</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Try unchecking some filter options or clearing your search term to see more recipes.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#557A61] hover:bg-[#3E5C47] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

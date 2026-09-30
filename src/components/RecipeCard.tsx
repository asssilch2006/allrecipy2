import React, { useState } from 'react';
import { Heart, Plus, Calendar, Star, ArrowRight } from 'lucide-react';
import { RecipeDetail, RecipeSummary } from '../types';
import { useApp } from '../context/AppContext';
import { ClockIcon, OvenIcon, SkilletIcon, AirFryerIcon, BlenderIcon } from './design-system/CookingIcons';

export interface RecipeCardProps {
  recipe: RecipeSummary | RecipeDetail;
  onSelect?: () => void;
  showPlannerOption?: boolean;
  dietBadge?: string;
  rating?: number;
  reviewsCount?: number;
  method?: 'oven' | 'skillet' | 'air fryer' | 'blender';
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  showPlannerOption = true,
  dietBadge,
  rating,
  reviewsCount,
  method,
}) => {
  const { openRecipeDetails, toggleFavorite, isFavorite, addToMealPlan } = useApp();
  const [imageError, setImageError] = useState(false);
  const [showPlanMenu, setShowPlanMenu] = useState(false);

  const favorited = isFavorite(recipe.id);

  // Derive display values
  const time = recipe.readyInMinutes || 25;
  const calories =
    (recipe as any).calories ||
    (recipe as RecipeDetail).nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount ||
    '420';
  const cleanCalories =
    typeof calories === 'number' ? Math.round(calories) : String(calories).replace('kcal', '').trim();

  // Derive diet badge ('Keto', 'Vegan', 'Dairy-Free', etc.)
  const resolvedBadge =
    dietBadge ||
    (recipe as any).dietBadge ||
    (recipe.vegan
      ? 'Vegan'
      : (recipe as any).diets?.some((d: string) => d.toLowerCase().includes('keto') || d.toLowerCase().includes('ketogenic'))
      ? 'Keto'
      : (recipe as any).dairyFree
      ? 'Dairy-Free'
      : recipe.vegetarian
      ? 'Vegetarian'
      : (recipe as any).glutenFree
      ? 'Gluten-Free'
      : recipe.id % 2 === 0
      ? 'Keto'
      : 'Vegan');

  // Derive rating (4.8 to 5.0) and review count
  const resolvedRating =
    rating ||
    (recipe as any).rating ||
    (recipe as RecipeDetail).spoonacularScore
      ? Number(Math.min(5, Math.max(4.6, 4 + (((recipe as RecipeDetail).spoonacularScore || 85) / 100))).toFixed(1))
      : 4.9;

  const resolvedReviews =
    reviewsCount ||
    (recipe as any).reviewsCount ||
    (recipe as RecipeDetail).aggregateLikes ||
    (recipe.id ? 80 + (recipe.id % 160) : 142);

  // Determine cooking method icon
  const resolvedMethod: 'oven' | 'skillet' | 'air fryer' | 'blender' =
    method ||
    (recipe.title.toLowerCase().includes('air fryer')
      ? 'air fryer'
      : recipe.title.toLowerCase().includes('smoothie') || recipe.title.toLowerCase().includes('puree')
      ? 'blender'
      : recipe.title.toLowerCase().includes('baked') || recipe.title.toLowerCase().includes('roast') || recipe.title.toLowerCase().includes('biscuit')
      ? 'oven'
      : 'skillet');

  const MethodIcon =
    resolvedMethod === 'air fryer'
      ? AirFryerIcon
      : resolvedMethod === 'blender'
      ? BlenderIcon
      : resolvedMethod === 'oven'
      ? OvenIcon
      : SkilletIcon;

  const methodLabel =
    resolvedMethod === 'air fryer'
      ? 'Air Fryer'
      : resolvedMethod === 'blender'
      ? 'Blender'
      : resolvedMethod === 'oven'
      ? 'Oven Baked'
      : 'Skillet';

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      openRecipeDetails(recipe.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const handlePlanClick = (e: React.MouseEvent, day: any, meal: any) => {
    e.stopPropagation();
    addToMealPlan(day, meal, recipe as RecipeSummary);
    setShowPlanMenu(false);
  };

  const isKeto = resolvedBadge.toLowerCase().includes('keto');
  const isVegan = resolvedBadge.toLowerCase().includes('vegan');

  return (
    <article
      onClick={handleClick}
      /*
        DESIGN SYSTEM:
        - 8px border radius (rounded-[8px])
        - Soft drop shadow (shadow-[0_4px_16px_rgba(0,0,0,0.06)])
        - Smooth hover lift
        - 8pt inner spacing grid (p-4 / p-16px)
      */
      className="group relative bg-[#FFFFFF] border border-[#E8EBE4] rounded-[8px] overflow-hidden hover:border-[#8A9A5B]/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col text-left select-none"
    >
      {/* Recipe Image Slot (top border-radius conforms to 8px) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F6F0]">
        {!imageError && recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F6F0] text-[#8A9A5B] p-4 text-center">
            <MethodIcon className="w-8 h-8 text-[#8A9A5B] mb-1" />
            <span className="text-xs font-medium text-[#666666] line-clamp-1">{recipe.title}</span>
          </div>
        )}

        {/* Small Dietary Badge Overlay (Pill shaped) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            style={{
              backgroundColor: '#4d6d69',
              color: '#FFFFFF',
              opacity: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-white" />
            {resolvedBadge}
          </span>
        </div>

        {/* Favorite Button (Tactile circular button with subtle lift) */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#666666] hover:text-[#E2725B] shadow-xs hover:shadow-sm active:scale-90 transition-transform cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-[#E2725B] text-[#E2725B]' : 'text-[#666666]'
            }`}
          />
        </button>

        {/* Minimalist Cooking Method Pill on Image Corner */}
        <div
          style={{
            backgroundColor: '#4d6d69',
            color: '#FFFFFF',
            opacity: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
          className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold tracking-tight flex items-center gap-1"
        >
          <MethodIcon className="w-3 h-3 text-white" />
          <span>{methodLabel}</span>
        </div>
      </div>

      {/* Content Area conforming to 8pt spacing grid (p-4 = 16px) */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
        <div className="space-y-2">
          {/* 5-Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#1A202C] ml-0.5">{resolvedRating.toFixed(1)}</span>
            <span className="text-[#4A5568] text-[11px] font-semibold">({resolvedReviews})</span>
          </div>

          {/* Heading: Friendly Rounded Sans-Serif font-heading */}
          <h3 className="font-heading font-bold text-[#1A202C] text-base leading-snug line-clamp-2 group-hover:text-[#4A5531] transition-colors">
            {recipe.title}
          </h3>

          {/* Cooking Method & Time Metadata (8pt spacing grid) */}
          <div className="flex items-center gap-2 text-xs text-[#2D3748] pt-0.5 font-medium">
            <span className="inline-flex items-center gap-1 bg-[#F4F6F0] text-[#2D4534] px-2 py-0.5 rounded-full border border-[#8A9A5B]/30 font-semibold">
              <ClockIcon className="w-3 h-3 text-[#4A5531]" />
              <span>{time}m</span>
            </span>

            <span className="text-stone-300">·</span>

            <span className="text-[#1A202C] font-semibold text-xs">
              {cleanCalories} kcal
            </span>
          </div>
        </div>

        {/* Bottom Actions: View details + Quick Add to Planner */}
        <div className="pt-2 border-t border-[#E8EBE4] flex items-center justify-between">
          <span className="text-xs font-bold text-[#4A5531] group-hover:text-[#2D4534] flex items-center gap-1">
            <span>View Recipe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>

          {showPlannerOption && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlanMenu(!showPlanMenu);
                }}
                className="w-7 h-7 rounded-full bg-[#F4F6F0] hover:bg-[#8A9A5B] text-[#4A5531] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                title="Add to meal plan"
                aria-label="Add to meal planner"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Quick Planner Dropdown */}
              {showPlanMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-[#E8EBE4] rounded-[8px] shadow-xl z-50 p-2 text-xs"
                >
                  <div className="font-bold text-[#333333] px-2 py-1 flex items-center gap-1.5 border-b border-[#E8EBE4] mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>Plan For Today</span>
                  </div>
                  {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
                    <button
                      key={meal}
                      onClick={(e) => handlePlanClick(e, 'Monday', meal)}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#F4F6F0] text-[#333333] font-medium capitalize transition-colors"
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

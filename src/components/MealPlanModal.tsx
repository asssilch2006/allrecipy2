import React, { useState } from 'react';
import { CalendarDays, X, Check, Sparkles, ArrowRight, Flame, Clock, Heart, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WeeklyPlan } from '../types';

interface MealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PLANS = [
  {
    id: 'mediterranean',
    title: '7-Day Mediterranean Clean Reset',
    badge: 'Most Popular',
    description: 'Anti-inflammatory whole foods, extra virgin olive oil, wild seafood, crisp greens, and heirloom grains.',
    calories: '1,850 kcal/day avg',
    prepTime: '25 min avg prep',
    icon: Leaf,
    color: 'emerald',
    sampleMeals: [
      'Artisan Shakshuka with Poached Eggs & Feta',
      'Mediterranean Quinoa Nourish Bowl',
      'Grilled Salmon with Roasted Asparagus & Lemon',
    ],
  },
  {
    id: 'plant_vitality',
    title: 'Plant-Powered Vitality Plan',
    badge: '100% Vegetarian',
    description: 'Vibrant whole-plant recipes loaded with prebiotic fiber, colorful vegetables, and complete plant proteins.',
    calories: '1,750 kcal/day avg',
    prepTime: '20 min avg prep',
    icon: Sparkles,
    color: 'green',
    sampleMeals: [
      'Avocado Green Goddess Toast',
      'Golden Turmeric Chickpea Curry',
      'Warm Lentil & Roasted Beet Salad with Walnuts',
    ],
  },
  {
    id: 'quick_weeknights',
    title: '30-Minute Busy Weeknights',
    badge: 'Speed & Ease',
    description: 'Nutritious chef-tested dinners with minimal cleanup and under 30 minutes from cutting board to table.',
    calories: '1,900 kcal/day avg',
    prepTime: '15-25 min prep',
    icon: Clock,
    color: 'orange',
    sampleMeals: [
      'Overnight Chia & Berry Parfait',
      'Sheet-Pan Herb Chicken with Sweet Potato',
      'Garlic Butter Cauliflower & Edamame Noodles',
    ],
  },
  {
    id: 'high_protein',
    title: 'High-Protein Muscle & Energy',
    badge: 'Active Nutrition',
    description: 'Macro-balanced meal strategy with 35g+ clean protein per meal for recovery and sustained vitality.',
    calories: '2,100 kcal/day avg',
    prepTime: '30 min avg prep',
    icon: Flame,
    color: 'amber',
    sampleMeals: [
      'Power Protein Egg White Omelet with Spinach',
      'Seared Tuna & Brown Rice Bowl',
      'Turkey Meatballs in San Marzano Marinara',
    ],
  },
];

export const MealPlanModal: React.FC<MealPlanModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, showToast, addToMealPlan } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState('mediterranean');

  if (!isOpen) return null;

  const handleApplyPlan = () => {
    const chosen = PRESET_PLANS.find((p) => p.id === selectedPlanId);
    
    // Seed sample days
    addToMealPlan('Monday', 'breakfast', {
      id: 632660,
      title: 'Artisan Shakshuka with Poached Eggs & Feta',
      image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
      readyInMinutes: 25,
      calories: 320,
    });
    addToMealPlan('Monday', 'lunch', {
      id: 715538,
      title: 'Mediterranean Quinoa Nourish Bowl',
      image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
      readyInMinutes: 25,
      calories: 520,
    });
    addToMealPlan('Monday', 'dinner', {
      id: 716429,
      title: 'Pasta with Garlic, Scallions & Cauliflower',
      image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
      readyInMinutes: 30,
      calories: 485,
    });

    addToMealPlan('Tuesday', 'breakfast', {
      id: 715497,
      title: 'Berry Power Acai Bowl with Granola',
      image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
      readyInMinutes: 15,
      calories: 340,
    });
    addToMealPlan('Tuesday', 'dinner', {
      id: 716429,
      title: 'Pasta with Garlic & Lemon Greens',
      image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
      readyInMinutes: 25,
      calories: 450,
    });

    showToast(`Loaded ${chosen?.title || 'Healthy Meal Plan'} into your planner!`);
    onClose();
    setActiveTab('planner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-50 via-emerald-50/40 to-stone-50 border-b border-stone-200/80 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 bg-white/90 rounded-full border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D96B43]/10 text-[#D96B43] border border-[#D96B43]/20">
              Personalized Nutrition
            </span>
            <span className="text-xs text-stone-400">• Free & Instant</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 tracking-tight">
            Choose Your Healthy Meal Plan
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            Select a dietitian-approved weekly template or customize every single meal with our interactive drag & drop planner.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3.5 custom-scrollbar flex-1">
          {PRESET_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-600/30'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{plan.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Micro info */}
                <div className="mt-3 pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                  <div className="flex items-center gap-3">
                    <span>{plan.calories}</span>
                    <span>•</span>
                    <span>{plan.prepTime}</span>
                  </div>
                  <span className="text-emerald-700 font-medium">Includes automated grocery list</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveTab('planner');
              onClose();
            }}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Or start with a blank weekly calendar →
          </button>

          <button
            onClick={handleApplyPlan}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#D96B43] hover:bg-[#C85D36] active:bg-[#B7512C] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-[#D96B43]/25 transition-all"
          >
            <span>Apply Plan & Open Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

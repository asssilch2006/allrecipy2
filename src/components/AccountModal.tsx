import React, { useState, useEffect } from 'react';
import { User, X, Check, Heart, CalendarDays, ShoppingBag, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { favorites, weeklyPlan, groceryList, setActiveTab, showToast } = useApp();

  // Local dietary preferences saved in localStorage
  const [preferences, setPreferences] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('allrecipy_diet_prefs');
      return saved ? JSON.parse(saved) : {
        'Gluten-Free': false,
        'Vegetarian': true,
        'Dairy-Free': false,
        'Low Carb': false,
        'Nut-Free': false,
        'Mediterranean Focus': true,
      };
    } catch {
      return {
        'Gluten-Free': false,
        'Vegetarian': true,
        'Dairy-Free': false,
        'Low Carb': false,
        'Nut-Free': false,
        'Mediterranean Focus': true,
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('allrecipy_diet_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.warn(e);
    }
  }, [preferences]);

  if (!isOpen) return null;

  const togglePref = (key: string) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Updated preference: ${key} is now ${updated[key] ? 'active' : 'disabled'}`);
      return updated;
    });
  };

  // Count planned meals
  const plannedMealCount = Object.values(weeklyPlan).reduce((acc, day) => {
    return acc + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 flex flex-col">
        {/* Header Profile Badge */}
        <div className="p-6 bg-gradient-to-br from-stone-50 to-emerald-50/50 border-b border-stone-200/80 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 bg-white/80 rounded-full border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-display text-2xl font-bold shadow-md shadow-emerald-700/20">
              <User className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-stone-900 text-base">Healthy Kitchen Member</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Free Access • Saved Locally</p>
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                No Login or Subscription Required
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
            <button
              onClick={() => { setActiveTab('recipes'); onClose(); }}
              className="flex flex-col items-center hover:bg-white rounded-xl p-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 mb-1" />
              <span className="text-base font-bold text-stone-900 tabular-nums">{favorites.length}</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Favorites</span>
            </button>
            <button
              onClick={() => { setActiveTab('planner'); onClose(); }}
              className="flex flex-col items-center hover:bg-white rounded-xl p-1.5 transition-colors"
            >
              <CalendarDays className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-base font-bold text-stone-900 tabular-nums">{plannedMealCount}</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Planned</span>
            </button>
            <button
              onClick={() => { setActiveTab('grocery'); onClose(); }}
              className="flex flex-col items-center hover:bg-white rounded-xl p-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-orange-600 mb-1" />
              <span className="text-base font-bold text-stone-900 tabular-nums">{groceryList.length}</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">Grocery</span>
            </button>
          </div>

          {/* Dietary Goals & Preferences */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Dietary Preferences & Filters
              </h4>
              <span className="text-[11px] text-stone-500">Auto-filters recipes</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(preferences).map(([key, active]) => (
                <button
                  key={key}
                  onClick={() => togglePref(key)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    active
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="truncate">{key}</span>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Trust statement */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-2.5 text-stone-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              All of your preferences, recipe bookmarks, and weekly menus are securely stored locally on this device.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              localStorage.removeItem('allrecipy_favorites');
              localStorage.removeItem('allrecipy_meal_plan');
              localStorage.removeItem('allrecipy_grocery_list');
              showToast('Reset saved kitchen data');
              onClose();
              window.location.reload();
            }}
            className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Data
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

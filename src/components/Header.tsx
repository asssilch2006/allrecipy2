import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  User,
  ChevronDown,
  CalendarDays,
  ShoppingBag,
  UtensilsCrossed,
  BookOpen,
  Sparkles,
  Heart,
  X,
  Menu,
  Leaf,
  Clock,
  Flame,
  ArrowRight,
  ShieldCheck,
  Check,
  ChefHat,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchModal } from './SearchModal';
import { AccountModal } from './AccountModal';
import { MealPlanModal } from './MealPlanModal';
import { AboutModal } from './AboutModal';
import { CookbookModal } from './CookbookModal';
import { DesignSystemModal } from './design-system/DesignSystemModal';
import { Palette } from 'lucide-react';

type DropdownId = 'recipes' | 'shop' | 'planner' | 'cookbooks' | 'about' | null;

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    favorites,
    groceryList,
    weeklyPlan,
    toggleAiChef,
    openRecipeDetails,
    showToast,
  } = useApp();

  // Active Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMealPlanOpen, setIsMealPlanOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCookbookOpen, setIsCookbookOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<DropdownId>(null);

  // Unchecked grocery count for live badge
  const uncheckedGroceryCount = groceryList.filter((i) => !i.checked).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDropdownToggle = (id: DropdownId) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleNavigate = (tab: any, callback?: () => void) => {
    setActiveTab(tab);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <>
      {/* ================= STICKY WEBSITE HEADER ================= */}
      <header
        ref={dropdownRef}
        className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] select-none transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* ================= LEFT-ALIGNED: FRIENDLY HANDWRITTEN LOGO ================= */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-[0.98]"
              aria-label="allrecipy.com home"
            >
              {/* Botanical Leaf Sprig Icon in Sage Green */}
              <div className="w-9 h-9 rounded-2xl bg-[#EEF4F0] border border-[#DCE8DF] flex items-center justify-center text-[#557A61] shadow-2xs group-hover:bg-[#E4ECE7] transition-colors">
                <svg
                  className="w-5 h-5 stroke-[2.2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 7-7c1 0 2 .2 3 .5" />
                  <path d="M11 2a10 10 0 0 1 10 10c0 4.5-3 8-7 9.5" />
                  <path d="m11 13 4-4" />
                </svg>
              </div>

              {/* Handwritten Logo in Sage Green and Charcoal */}
              <div className="flex flex-col">
                <div className="flex items-baseline font-handwriting text-2xl sm:text-3xl font-bold tracking-tight leading-none">
                  <span className="text-[#557A61]">all</span>
                  <span className="text-[#2D312E]">recipy</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D96B43] ml-0.5 mb-1 group-hover:scale-125 transition-transform" />
                </div>
                <span className="text-[10px] font-medium tracking-wider uppercase text-stone-400 -mt-0.5 hidden sm:block">
                  Wholesome & Fresh
                </span>
              </div>
            </button>
          </div>

          {/* ================= CENTER: HORIZONTAL NAVIGATION LINKS WITH CLEAN DROPDOWN INDICATORS ================= */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2 text-[14.5px] font-medium text-stone-700"
            aria-label="Main Navigation"
          >
            {/* 1. RECIPES */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('recipes')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('recipes')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === 'recipes' || activeDropdown === 'recipes'
                    ? 'text-stone-950 font-semibold bg-stone-100/70'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                aria-expanded={activeDropdown === 'recipes'}
              >
                <span>Recipes</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    activeDropdown === 'recipes' ? 'rotate-180 text-stone-700' : ''
                  }`}
                />
              </button>

              {/* Recipes Dropdown Card */}
              {activeDropdown === 'recipes' && (
                <div className="absolute top-full left-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Explore Healthy Cooking
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-700">
                          All Healthy Recipes
                        </div>
                        <div className="text-[11px] text-stone-500">
                          300,000+ dietitian-curated dishes
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-orange-700">
                          30-Minute Dinners
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Fast, wholesome weeknight staples
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-teal-700">
                          Plant-Based & Vegan Bowls
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Nutrient-dense grains & crisp greens
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-700">
                          High Protein & Active Fuel
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Wild salmon, lean proteins & legumes
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 px-3 py-1 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Pantry fridge search?</span>
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Find by ingredients →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SHOP */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('shop')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavigate('shop')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === 'shop' || activeDropdown === 'shop'
                    ? 'text-stone-950 font-semibold bg-stone-100/70'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                aria-expanded={activeDropdown === 'shop'}
              >
                <span>Shop</span>
                {uncheckedGroceryCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#557A61]" />
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    activeDropdown === 'shop' ? 'rotate-180 text-stone-700' : ''
                  }`}
                />
              </button>

              {/* Shop Dropdown Card */}
              {activeDropdown === 'shop' && (
                <div className="absolute top-full left-0 mt-1.5 w-76 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Smart Kitchen Shop
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleNavigate('shop')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#557A61] flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-[#557A61]">
                          Organic Pantry Staples
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Superfine Almond Flour & Monk Fruit
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('grocery')}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#D97757] flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-[#D97757]">
                            Smart Grocery List
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Aisle-sorted checklist & export
                          </div>
                        </div>
                      </div>
                      {uncheckedGroceryCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#557A61] text-white">
                          {uncheckedGroceryCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        handleNavigate('grocery');
                        showToast('Opened Farmers Market Guide');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-700">
                          Seasonal Produce Guide
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Peak-season produce calendar
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. MEAL PLANS */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('planner')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('planner')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === 'planner' || activeDropdown === 'planner'
                    ? 'text-stone-950 font-semibold bg-stone-100/70'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                aria-expanded={activeDropdown === 'planner'}
              >
                <span>Meal Plans</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    activeDropdown === 'planner' ? 'rotate-180 text-stone-700' : ''
                  }`}
                />
              </button>

              {/* Meal Plans Dropdown Card */}
              {activeDropdown === 'planner' && (
                <div className="absolute top-full left-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Weekly Meal Organization
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleNavigate('planner')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-700">
                          Interactive Weekly Planner
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Drag & drop breakfast, lunch & dinner
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsMealPlanOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50/60 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#D96B43]/10 text-[#D96B43] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-[#D96B43]">
                          7-Day Mediterranean Clean Reset
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Pre-loaded dietitian meal plan
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate('grocery')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-teal-700">
                          Generate Grocery List
                        </div>
                        <div className="text-[11px] text-stone-500">
                          1-click sync from this week's meals
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. COOKBOOKS */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('cookbooks')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('cookbooks')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === 'cooking' || activeDropdown === 'cookbooks'
                    ? 'text-stone-950 font-semibold bg-stone-100/70'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                aria-expanded={activeDropdown === 'cookbooks'}
              >
                <span>Cookbooks</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    activeDropdown === 'cookbooks' ? 'rotate-180 text-stone-700' : ''
                  }`}
                />
              </button>

              {/* Cookbooks Dropdown Card */}
              {activeDropdown === 'cookbooks' && (
                <div className="absolute top-full left-0 mt-1.5 w-76 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Culinary Collections & Guides
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => handleNavigate('cooking')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-700">
                          Distraction-Free Cook Mode
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Step-by-step hands-free with timers
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsCookbookOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-stone-950">
                          The Wholesome Table (Digital)
                        </div>
                        <div className="text-[11px] text-stone-500">
                          45 dietitian-tested healthy meals
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. ABOUT */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleDropdownToggle('about')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeDropdown === 'about'
                    ? 'text-stone-950 font-semibold bg-stone-100/70'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                aria-expanded={activeDropdown === 'about'}
              >
                <span>About</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    activeDropdown === 'about' ? 'rotate-180 text-stone-700' : ''
                  }`}
                />
              </button>

              {/* About Dropdown Card */}
              {activeDropdown === 'about' && (
                <div className="absolute top-full right-0 lg:left-0 mt-1.5 w-76 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Our Mission & Standards
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsAboutOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-700">
                          Our Food Philosophy
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Clean ingredients & wholesome eating
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        toggleAiChef();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/60 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">
                          Chef Auguste AI Assistant
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Substitutions & cooking guidance
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsAboutOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 group-hover:text-stone-950">
                          100% Free & Open Access
                        </div>
                        <div className="text-[11px] text-stone-500">
                          No login or paywalls required
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsDesignSystemOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F6F0] text-left transition-colors group border-t border-stone-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#8A9A5B]/15 text-[#8A9A5B] flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#333333] group-hover:text-[#8A9A5B]">
                          Wholesome Design System
                        </div>
                        <div className="text-[11px] text-[#666666]">
                          Sage Green, Terracotta & 8pt grid
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ================= RIGHT-ALIGNED: MINIMALIST SEARCH, USER ACCOUNT & CTA BUTTON ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Design System Pill Button */}
            <button
              onClick={() => setIsDesignSystemOpen(true)}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F6F0] hover:bg-[#E8ECE0] text-[#4A5531] text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 cursor-pointer"
              title="View UI/UX Design System"
            >
              <span className="w-2 h-2 rounded-full bg-[#8A9A5B]" />
              <span>Design System</span>
            </button>

            {/* 1. Minimalist Magnifying Glass Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors active:scale-95 relative"
              aria-label="Search recipes"
              title="Search recipes & ingredients"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* 2. User Account Icon */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 sm:p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors active:scale-95 relative"
              aria-label="User account and dietary preferences"
              title="Dietary Preferences & Saved Kitchen"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8A9A5B] ring-2 ring-white" />
              )}
            </button>

            {/* Quick Favorites shortcut (desktop only) */}
            <button
              onClick={() => handleNavigate('recipes')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50/60 rounded-full transition-colors"
              title="View favorites"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="tabular-nums font-semibold">{favorites.length}</span>
            </button>

            {/* 3. Prominent, Pill-Shaped 'Get Meal Plans' CTA Button in Warm Terracotta (#E2725B) with subtle hover lift */}
            <button
              onClick={() => setIsMealPlanOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#E2725B] hover:bg-[#D05E47] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all duration-200 cursor-pointer group"
            >
              <CalendarDays className="w-4 h-4 opacity-95 group-hover:scale-105 transition-transform" />
              <span>Get Meal Plans</span>
            </button>

            {/* Mobile Menu Hamburger Toggle (screen < md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE EXPANDABLE DRAWER ================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/80 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-3 duration-200">
            {/* Quick Action in Mobile Menu */}
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>Search healthy recipes...</span>
                </div>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {/* Recipes */}
              <div>
                <button
                  onClick={() =>
                    setMobileExpandedSection(
                      mobileExpandedSection === 'recipes' ? null : 'recipes'
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <UtensilsCrossed className="w-4 h-4 text-[#557A61]" />
                    <span>Recipes</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      mobileExpandedSection === 'recipes' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'recipes' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 text-xs text-stone-600 bg-stone-50/50 rounded-xl mb-1">
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      All Healthy Recipes
                    </button>
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      30-Minute Dinners
                    </button>
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      Plant-Based & Vegan Bowls
                    </button>
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      High Protein Meals
                    </button>
                  </div>
                )}
              </div>

              {/* Shop */}
              <div>
                <button
                  onClick={() =>
                    setMobileExpandedSection(
                      mobileExpandedSection === 'shop' ? null : 'shop'
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#557A61]" />
                    <span>Shop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {uncheckedGroceryCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                        {uncheckedGroceryCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        mobileExpandedSection === 'shop' ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {mobileExpandedSection === 'shop' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 text-xs text-stone-600 bg-stone-50/50 rounded-xl mb-1">
                    <button
                      onClick={() => handleNavigate('grocery')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      Smart Grocery List ({uncheckedGroceryCount} items)
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate('grocery');
                        showToast('Pantry Checklist loaded');
                      }}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      Organic Pantry Checklist
                    </button>
                  </div>
                )}
              </div>

              {/* Meal Plans */}
              <div>
                <button
                  onClick={() =>
                    setMobileExpandedSection(
                      mobileExpandedSection === 'planner' ? null : 'planner'
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-[#557A61]" />
                    <span>Meal Plans</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      mobileExpandedSection === 'planner' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'planner' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 text-xs text-stone-600 bg-stone-50/50 rounded-xl mb-1">
                    <button
                      onClick={() => handleNavigate('planner')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      Weekly Meal Planner
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMealPlanOpen(true);
                      }}
                      className="w-full text-left py-1.5 text-[#D96B43] font-semibold"
                    >
                      7-Day Mediterranean Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Cookbooks */}
              <div>
                <button
                  onClick={() =>
                    setMobileExpandedSection(
                      mobileExpandedSection === 'cookbooks' ? null : 'cookbooks'
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#557A61]" />
                    <span>Cookbooks</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      mobileExpandedSection === 'cookbooks' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpandedSection === 'cookbooks' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 text-xs text-stone-600 bg-stone-50/50 rounded-xl mb-1">
                    <button
                      onClick={() => handleNavigate('cooking')}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      Distraction-Free Cook Mode
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCookbookOpen(true);
                      }}
                      className="w-full text-left py-1.5 hover:text-emerald-700"
                    >
                      The Wholesome Table (Digital Edition)
                    </button>
                  </div>
                )}
              </div>

              {/* About */}
              <div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAboutOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-[#557A61]" />
                    <span>About & Philosophy</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Footer CTA */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMealPlanOpen(true);
                }}
                className="w-full py-3 rounded-full bg-[#E2725B] hover:bg-[#D05E47] text-white text-xs font-bold tracking-tight shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Get Meal Plans</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= MODALS & OVERLAYS ================= */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
      <MealPlanModal isOpen={isMealPlanOpen} onClose={() => setIsMealPlanOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <CookbookModal isOpen={isCookbookOpen} onClose={() => setIsCookbookOpen(false)} />
      <DesignSystemModal isOpen={isDesignSystemOpen} onClose={() => setIsDesignSystemOpen(false)} />
    </>
  );
};

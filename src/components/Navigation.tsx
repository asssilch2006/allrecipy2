import React from 'react';
import { Home, UtensilsCrossed, CalendarDays, ShoppingBag, Sparkles, ChefHat, Heart, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, groceryList, favorites, toggleAiChef } = useApp();

  const uncheckedGroceryCount = groceryList.filter((i) => !i.checked).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
    { id: 'planner', label: 'Planner', icon: CalendarDays },
    { id: 'grocery', label: 'Grocery', icon: ShoppingBag, badge: uncheckedGroceryCount > 0 ? uncheckedGroceryCount : null },
    { id: 'shop', label: 'Pantry Store', icon: Leaf },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-stone-200 h-full p-5 justify-between select-none">
        <div className="flex flex-col gap-8">
          {/* Sidebar Section Title */}
          <div className="flex items-center justify-between px-3 pt-1 text-xs font-bold uppercase tracking-wider text-[#2D3748]">
            <span>Kitchen Hub</span>
            <span className="text-[10px] font-bold normal-case text-[#2D4534] bg-[#8A9A5B]/15 px-2 py-0.5 rounded-full">Free Access</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8A9A5B]/15 text-[#2D4534] font-bold shadow-xs'
                      : 'text-[#1A202C] hover:text-black hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#8A9A5B]' : 'text-[#4A5568]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#8A9A5B] text-white tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics & Saved Shortcuts */}
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 text-xs font-bold text-[#2D3748] uppercase tracking-wider">
              <span>Saved Collections</span>
            </div>
            <button
              onClick={() => setActiveTab('recipes')}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1A202C] hover:text-black hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Favorites</span>
              </div>
              <span className="text-[#2D3748] font-bold tabular-nums">{favorites.length}</span>
            </button>
          </div>
        </div>

        {/* AI Sous Chef Floating Callout */}
        <div
          style={{ color: '#2a6b49', backgroundColor: '#06582b' }}
          className="p-4 rounded-2xl shadow-md relative overflow-hidden"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#8A9A5B]/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#8A9A5B] flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span
              style={{ color: '#a5b4a8' }}
              className="text-xs font-bold tracking-wide uppercase"
            >
              Chef Auguste
            </span>
          </div>
          <p
            style={{ color: '#adb7cd' }}
            className="text-xs mb-3 leading-relaxed font-medium"
          >
            Need ingredient substitutions, wine pairing, or cooking tips?
          </p>
          <button
            onClick={toggleAiChef}
            className="w-full py-2 px-3 bg-[#8A9A5B] hover:bg-[#77864B] active:bg-[#687640] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Ask AI Sous Chef</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      {/* 15% sticky height compliance: compact 60px tab bar + safe bottom */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 pb-safe pt-1 shadow-lg"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 items-center h-14">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`min-h-[48px] flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
                  isActive ? 'text-[#8A9A5B] font-bold' : 'text-[#2D3748] font-semibold hover:text-[#1A202C]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
                <span className="text-[11px] font-bold tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-[#8A9A5B] rounded-full" />
                )}
              </button>
            );
          })}

          {/* Center AI Chef Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={toggleAiChef}
              aria-label="Ask AI Chef"
              className="w-11 h-11 -mt-3 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`min-h-[48px] flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
                  isActive ? 'text-[#8A9A5B] font-bold' : 'text-[#2D3748] font-semibold hover:text-[#1A202C]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#8A9A5B] text-white tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-[#8A9A5B] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { RecipesView } from './components/views/RecipesView';
import { RecipeDetailsView } from './components/views/RecipeDetailsView';
import { CookModeView } from './components/views/CookModeView';
import { PlannerView } from './components/views/PlannerView';
import { GroceryListView } from './components/views/GroceryListView';
import { ProductView } from './components/views/ProductView';
import { AiChefDrawer } from './components/AiChefDrawer';
import { Check, Info, X } from 'lucide-react';

interface ToastItemProps {
  toast: { id: number; message: string; type: 'success' | 'info' };
  index: number;
  onDismiss: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index, onDismiss }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 5000ms (5 seconds)
    const timer = setTimeout(() => {
      triggerDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id]);

  const triggerDismiss = () => {
    setIsFadingOut(true);
    // Smooth fade-out animation (opacity: 1 -> 0 over 300ms) before removal from DOM
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  const isSavedFavorite = toast.message.toLowerCase().includes('saved to favorites');
  const isRemovedFavorite = toast.message.toLowerCase().includes('removed from favorites');

  let toastBg: string | undefined = undefined;
  let toastBorder: string | undefined = undefined;

  if (isRemovedFavorite || (index === 1 && !isSavedFavorite)) {
    toastBg = '#33a261';
    toastBorder = 'border-emerald-600';
  } else if (isSavedFavorite || index === 0) {
    toastBg = '#db160a';
    toastBorder = 'border-red-600';
  }

  return (
    <div
      style={toastBg ? { backgroundColor: toastBg } : undefined}
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold text-white transition-all duration-300 ease-in-out ${
        isFadingOut ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 animate-in slide-in-from-top duration-200'
      } ${
        toastBorder
          ? toastBorder
          : toast.type === 'success'
          ? 'bg-stone-900 border-stone-800'
          : 'bg-emerald-900 border-emerald-800'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {toast.type === 'success' || isRemovedFavorite ? (
          <Check className="w-4 h-4 text-white stroke-[3] shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-white shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>

      {/* Manual Dismiss '×' Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          triggerDismiss();
        }}
        aria-label="Dismiss notification"
        title="Dismiss notification"
        className="p-1 -mr-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab, toasts, dismissToast } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'recipes':
        return <RecipesView />;
      case 'details':
        return <RecipeDetailsView />;
      case 'cooking':
        return <CookModeView />;
      case 'planner':
        return <PlannerView />;
      case 'grocery':
        return <GroceryListView />;
      case 'shop':
        return <ProductView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-stone-50 overflow-hidden font-sans text-stone-900">
      {/* Sticky Modern Clean Website Header across full top */}
      <Header />

      {/* Main Content Layout */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Navigation: Desktop Sidebar + Mobile Bottom Tab Bar */}
        <Navigation />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 custom-scrollbar pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* AI Sous Chef Floating Sheet Drawer */}
      <AiChefDrawer />

      {/* Global Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

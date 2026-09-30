import React from 'react';
import { X, BookOpen, Clock, Sparkles, ArrowRight, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COOKBOOKS = [
  {
    title: 'The Wholesome Table (Digital Edition)',
    author: 'Chef Auguste & Nutrition Team',
    recipesCount: '45 Recipes',
    description: 'Our flagship collection of anti-inflammatory dinners, vibrant breakfast bowls, and effortless 30-minute meals.',
    coverBg: 'from-emerald-800 to-stone-900',
    tag: 'Free Reader Edition',
  },
  {
    title: 'Nourish: 30-Minute Weeknight Magic',
    author: 'Clean Kitchen Series',
    recipesCount: '32 Recipes',
    description: 'Speedy, nutrient-packed sheet-pan dinners and one-skillet meals designed for zero stress and quick cleanup.',
    coverBg: 'from-amber-800 to-stone-900',
    tag: 'Quick Prep',
  },
  {
    title: 'Plant-Forward Feasts & Grain Bowls',
    author: 'Holistic Kitchen Lab',
    recipesCount: '28 Recipes',
    description: 'Hearty legumes, whole ancient grains, and rich tahini dressings that turn simple vegetables into craveable feasts.',
    coverBg: 'from-teal-800 to-emerald-950',
    tag: 'Plant-Based',
  },
];

export const CookbookModal: React.FC<CookbookModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, showToast } = useApp();

  if (!isOpen) return null;

  const handleOpenCookMode = () => {
    setActiveTab('cooking');
    onClose();
    showToast('Launched Distraction-Free Cook Mode');
  };

  const handleExploreRecipes = (tag: string) => {
    setActiveTab('recipes');
    onClose();
    showToast(`Browsing ${tag} recipes`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-50 via-emerald-50/30 to-stone-50 border-b border-stone-200/80 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 bg-white/90 rounded-full border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Digital Cookbooks & Guides
            </span>
            <span className="text-xs text-stone-400">• Included Free</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 tracking-tight">
            Curated Healthy Recipe Collections
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            Explore our curated culinary volumes, or step into hands-free distraction-free cook mode on your phone or tablet.
          </p>
        </div>

        {/* Cook Mode Banner */}
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Distraction-Free Cook Mode</h4>
              <p className="text-xs text-stone-300">Hands-free step-by-step guidance with auto timers & voice assistance.</p>
            </div>
          </div>
          <button
            onClick={handleOpenCookMode}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shrink-0 transition-colors"
          >
            Launch Cook Mode
          </button>
        </div>

        {/* Cookbooks Grid */}
        <div className="p-6 overflow-y-auto space-y-3.5 custom-scrollbar flex-1">
          {COOKBOOKS.map((book) => (
            <div
              key={book.title}
              className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-300 hover:bg-stone-50/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-16 rounded-xl bg-gradient-to-br ${book.coverBg} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                  <BookOpen className="w-5 h-5 opacity-80" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {book.title}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {book.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{book.description}</p>
                  <span className="text-[11px] font-medium text-stone-400 mt-1 inline-block">
                    {book.recipesCount} • {book.author}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleExploreRecipes(book.tag)}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-semibold shrink-0 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Read & Cook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

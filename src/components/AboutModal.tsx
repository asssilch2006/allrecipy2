import React from 'react';
import { X, Sparkles, Leaf, ShieldCheck, Heart, ChefHat, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { toggleAiChef } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50/40 border-b border-stone-200/80 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 bg-white/90 rounded-full border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-handwriting text-2xl font-bold text-[#557A61]">allrecipy</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Our Food Philosophy
            </span>
          </div>

          <h3 className="text-2xl font-bold font-display text-stone-900 tracking-tight">
            Wholesome Eating Made Simple & Accessible
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            We believe eating vibrant, nutrient-dense meals shouldn't require complex meal prep, expensive subscriptions, or compromise on flavor.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-stone-700 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Whole Foods & Clean Ingredients</h4>
              <p className="text-stone-600 text-xs mt-0.5">
                Every recipe is built around unrefined grains, heart-healthy cold-pressed oils, wild seafood, crisp produce, and aromatic herbs that naturally nourish the body.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">No Accounts, No Paywalls</h4>
              <p className="text-stone-600 text-xs mt-0.5">
                We believe healthy meal discovery should be an open utility for everyone. No login is needed to discover recipes, organize your weekly planner, or generate grocery checklists.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Chef Auguste AI Culinary Assistant</h4>
              <p className="text-stone-600 text-xs mt-0.5">
                Need ingredient substitutions for dietary restrictions? Wine pairings? Or ways to use leftover pantry items? Our embedded AI Sous Chef is available anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              toggleAiChef();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask Chef Auguste
          </button>

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

import React, { useState } from 'react';
import { X, Check, Copy, Sparkles, Layers, Palette, Type, Grid3X3, ArrowRight, Play, ShoppingBag } from 'lucide-react';
import { PillButton } from './PillButton';
import { OvenIcon, BlenderIcon, ClockIcon, SkilletIcon, AirFryerIcon } from './CookingIcons';
import { RecipeCard } from '../RecipeCard';

export interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_RECIPE = {
  id: 649931,
  title: 'One-Pan Citrus Herb Wild Salmon with Charred Asparagus',
  image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
  readyInMinutes: 20,
  calories: 460,
  dietBadge: 'Keto',
  rating: 5.0,
  reviewsCount: 184,
};

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (hex: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    }
  };

  const colors = [
    {
      name: 'Primary Sage Green',
      hex: '#8A9A5B',
      role: 'Brand identity, secondary highlights, tags, active states',
      bgClass: 'bg-[#8A9A5B]',
      textClass: 'text-white',
    },
    {
      name: 'Warm Terracotta',
      hex: '#E2725B',
      role: 'Primary high-conversion CTAs, attention accents, hot badges',
      bgClass: 'bg-[#E2725B]',
      textClass: 'text-white',
    },
    {
      name: 'Crisp White',
      hex: '#FFFFFF',
      role: 'Main page canvases, clean card backgrounds, crisp negative space',
      bgClass: 'bg-[#FFFFFF] border border-stone-200',
      textClass: 'text-[#333333]',
    },
    {
      name: 'Soft Charcoal',
      hex: '#333333',
      role: 'Primary heading and body typography for high legibility',
      bgClass: 'bg-[#333333]',
      textClass: 'text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-900/40 backdrop-blur-xs">
      <div
        className="relative bg-white border border-[#E8EBE4] rounded-[16px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-8 my-8 text-left max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E8EBE4] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#8A9A5B] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>allrecipy.com Design System</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#333333]">
              Wholesome UI/UX Design System
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Approachable, organized, fresh, and trustworthy design foundations for healthy living.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F4F6F0] hover:bg-stone-200 flex items-center justify-center text-[#666666] hover:text-[#333333] transition-colors cursor-pointer"
            aria-label="Close Design System Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Color Palette */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#8A9A5B]" />
            <h3 className="font-heading font-bold text-lg text-[#333333]">1. Color Palette</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div
                key={c.hex}
                onClick={() => copyToClipboard(c.hex)}
                className="group p-4 rounded-[8px] border border-[#E8EBE4] bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className={`w-full h-20 rounded-[6px] ${c.bgClass} flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-102`}
                >
                  <span className={c.textClass}>{c.hex}</span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#333333]">{c.name}</span>
                    {copiedColor === c.hex ? (
                      <span className="text-[10px] font-bold text-[#8A9A5B] flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 text-stone-400 group-hover:text-[#333333]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#666666] leading-tight">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="space-y-3 border-t border-[#E8EBE4] pt-6">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#8A9A5B]" />
            <h3 className="font-heading font-bold text-lg text-[#333333]">2. Typography Pairings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heading Font: Nunito */}
            <div className="p-5 rounded-[8px] bg-[#F4F6F0] border border-[#E8EBE4] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9A5B]">
                Heading Font · Nunito
              </span>
              <h4 className="font-heading text-2xl font-extrabold text-[#333333]">
                Approachable & Rounded
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Friendly, rounded sans-serif imparting warmth, kitchen hospitality, and high readability across desktop & mobile viewport banners.
              </p>
            </div>

            {/* Body Font: Inter */}
            <div className="p-5 rounded-[8px] bg-white border border-[#E8EBE4] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2725B]">
                Body Font · Inter
              </span>
              <p className="font-body text-sm font-medium text-[#333333] leading-relaxed">
                "Healthy eating should be joyous, frictionless, and nourishing."
              </p>
              <p className="text-xs text-[#666666] leading-relaxed">
                Clean, geometric neutral grotesque engineered for ultra-crisp microcopy, ingredient checklists, and nutrition tables.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Pill-Shaped Buttons with Subtle Hover Lifts */}
        <section className="space-y-3 border-t border-[#E8EBE4] pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8A9A5B]" />
              <h3 className="font-heading font-bold text-lg text-[#333333]">
                3. Pill-Shaped Buttons (Subtle Hover Lifts)
              </h3>
            </div>
            <span className="text-xs text-[#666666]">Hover to test micro-interaction</span>
          </div>

          <div className="p-6 rounded-[8px] bg-[#FAF8F5] border border-[#E8EBE4] flex flex-wrap items-center gap-4">
            {/* CTA Warm Terracotta */}
            <PillButton variant="cta" icon={<ShoppingBag className="w-4 h-4" />}>
              Warm Terracotta CTA
            </PillButton>

            {/* Primary Sage */}
            <PillButton variant="primary" icon={<Play className="w-4 h-4 fill-white" />}>
              Primary Sage Green
            </PillButton>

            {/* Secondary Sage Light */}
            <PillButton variant="secondary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Explore Recipes
            </PillButton>

            {/* Outline on Crisp White */}
            <PillButton variant="outline">
              Save to Favorites
            </PillButton>
          </div>
        </section>

        {/* Section 4: Recipe Cards (8px Border Radius & Soft Drop Shadow) + Cooking Method Line Icons */}
        <section className="space-y-4 border-t border-[#E8EBE4] pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-[#8A9A5B]" />
              <h3 className="font-heading font-bold text-lg text-[#333333]">
                4. Recipe Card (8px Radius & Soft Drop Shadows) & Line Icons
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8A9A5B]">rounded-[8px] · 8pt grid</span>
          </div>

          {/* Minimalist Line Icons Set */}
          <div className="p-4 rounded-[8px] bg-white border border-[#E8EBE4] flex flex-wrap items-center justify-around gap-4 text-xs text-[#333333] font-semibold">
            <div className="flex items-center gap-2">
              <OvenIcon className="w-5 h-5 text-[#8A9A5B]" />
              <span>Oven Baked</span>
            </div>
            <div className="flex items-center gap-2">
              <BlenderIcon className="w-5 h-5 text-[#8A9A5B]" />
              <span>Blender Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-[#8A9A5B]" />
              <span>Timing Clock</span>
            </div>
            <div className="flex items-center gap-2">
              <SkilletIcon className="w-5 h-5 text-[#8A9A5B]" />
              <span>Skillet Stovetop</span>
            </div>
            <div className="flex items-center gap-2">
              <AirFryerIcon className="w-5 h-5 text-[#8A9A5B]" />
              <span>Air Fryer</span>
            </div>
          </div>

          {/* Sample Recipe Card in 8px Radius */}
          <div className="max-w-sm mx-auto">
            <RecipeCard recipe={SAMPLE_RECIPE as any} method="skillet" />
          </div>
        </section>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-[#E8EBE4]">
          <PillButton variant="cta" onClick={onClose}>
            Back to Cooking Studio
          </PillButton>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Star,
  Check,
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Leaf,
  Flame,
  Info,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecipeCard } from '../RecipeCard';

// 3 related recipe cards using Almond Flour
const RELATED_ALMOND_RECIPES = [
  {
    id: 800104,
    title: 'Fluffy Almond Flour Pancakes with Fresh Berry Compote',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 18,
    calories: 360,
    dietBadge: 'Keto',
    rating: 5.0,
    reviewsCount: 220,
    vegan: false,
    vegetarian: true,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 800105,
    title: 'Air Fryer Almond-Crusted Chicken Cutlets with Lemon Dijon Dip',
    image: '/src/assets/images/recipe_crispy_salmon_asparagus_1790308621562.jpg',
    readyInMinutes: 20,
    calories: 395,
    dietBadge: 'Keto',
    rating: 4.9,
    reviewsCount: 165,
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    dairyFree: true,
  },
  {
    id: 800107,
    title: 'Keto Almond Flour Herbed Breakfast Biscuits with Poached Egg',
    image: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    readyInMinutes: 22,
    calories: 310,
    dietBadge: 'Keto',
    rating: 4.8,
    reviewsCount: 116,
    vegan: false,
    vegetarian: true,
    glutenFree: true,
    dairyFree: false,
  },
];

const PRODUCT_GALLERY = [
  {
    id: 'pouch',
    label: 'Packaging',
    src: '/src/assets/images/product_almond_flour_pouch_1790776709733.jpg',
    alt: 'Organic Superfine Blanched Almond Flour Pouch',
  },
  {
    id: 'texture',
    label: 'Silky Texture',
    src: '/src/assets/images/product_almond_flour_texture_1790776721424.jpg',
    alt: 'Macro texture of superfine blanched almond flour powder',
  },
  {
    id: 'baking',
    label: 'Baked Results',
    src: '/src/assets/images/product_almond_flour_baking_1790776734673.jpg',
    alt: 'Golden almond flour pancakes stacked on ceramic stoneware plate',
  },
  {
    id: 'finished',
    label: 'Serving Table',
    src: '/src/assets/images/hero_fresh_overhead_meal_1790308543474.jpg',
    alt: 'Finished grain-free wholesome dining spread',
  },
];

type ProductTab = 'description' | 'nutrition' | 'recipes';

export const ProductView: React.FC = () => {
  const { addToCart, showToast, setActiveTab } = useApp();

  // Active gallery image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected package size
  const [selectedSize, setSelectedSize] = useState<'1lb' | '2lb' | '4lb'>('2lb');
  const [quantity, setQuantity] = useState(1);

  // Active below-the-fold tab
  const [activeTabSection, setActiveTabSection] = useState<ProductTab>('description');

  // Zoom-on-hover coordinates
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Pricing based on selected size
  const sizeOptions: Record<'1lb' | '2lb' | '4lb', { label: string; price: number; origPrice: number; unitPrice: string; badge?: string }> = {
    '1lb': { label: '16 oz (1 lb)', price: 11.99, origPrice: 14.5, unitPrice: '$0.75 / oz' },
    '2lb': { label: '32 oz (2 lb)', price: 19.99, origPrice: 24.99, unitPrice: '$0.62 / oz', badge: 'Most Popular' },
    '4lb': { label: '64 oz (4 lb Bulk)', price: 34.99, origPrice: 45.0, unitPrice: '$0.55 / oz', badge: 'Best Value' },
  };

  const currentOption = sizeOptions[selectedSize];

  // Mouse move handler for interactive zoom-on-hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      name: 'Artisanal California Superfine Blanched Almond Flour',
      price: currentOption.price,
      quantity,
      size: currentOption.label,
    });
  };

  const activeImage = PRODUCT_GALLERY[activeImageIndex];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={() => setActiveTab('home')}
          className="hover:text-stone-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button
          onClick={() => setActiveTab('grocery')}
          className="hover:text-stone-900 transition-colors cursor-pointer"
        >
          Pantry Staples
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-stone-800">Superfine Almond Flour</span>
      </nav>

      {/* 
        SPLIT-SCREEN HERO SECTION:
        Left side: High-resolution product image with zoom-on-hover capability and thumbnail gallery below.
        Right side: Product title in bold, benefit-driven description, 5-star review summary, and prominent 'Add to Cart' button.
      */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT SIDE: Product Image & Zoom ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage with Zoom on Hover */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-stone-200/90 shadow-xs cursor-crosshair select-none"
            >
              {/* Product Image with dynamic transform-origin on hover */}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                  isZoomed ? 'scale-175' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      }
                    : undefined
                }
              />

              {/* Quality Seal Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#3E5C47] border border-[#557A61]/20 shadow-xs backdrop-blur-md">
                  <Leaf className="w-3.5 h-3.5 text-[#557A61]" />
                  <span>100% Steam-Blanched</span>
                </span>
              </div>

              {/* Hover to Zoom Hint */}
              <div
                className={`absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none transition-opacity duration-200 ${
                  isZoomed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span>Hover to zoom</span>
              </div>
            </div>

            {/* Thumbnail Gallery Below */}
            <div className="grid grid-cols-4 gap-3">
              {PRODUCT_GALLERY.map((thumb, index) => {
                const isActive = activeImageIndex === index;
                return (
                  <button
                    key={thumb.id}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View ${thumb.label}`}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#557A61] ring-2 ring-[#557A61]/30 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 inset-x-1 text-center bg-stone-900/60 backdrop-blur-xs text-white text-[9px] font-medium rounded py-0.5 truncate px-1">
                      {thumb.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT SIDE: Details & Cart ================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              {/* Category & Verified Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#557A61]">
                  Artisanal Healthy Pantry
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-medium">Non-GMO California Almonds</span>
              </div>

              {/* Product Title in Bold */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Artisanal California Superfine Blanched Almond Flour
              </h1>

              {/* 5-Star Review Summary */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-2">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-stone-900 text-sm">4.9 out of 5.0</span>
                <span className="text-stone-400 text-xs">·</span>
                <span className="text-[#557A61] font-semibold text-xs hover:underline cursor-pointer">
                  428 verified customer reviews
                </span>
              </div>
            </div>

            {/* Short Benefit-Driven Description */}
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              100% steam-pasteurized California nonpareil almonds micro-milled to an ultra-fine, silky consistency. Packed with 6g clean plant protein, only 3g net carbs, and wholesome vitamin E per serving. Flawlessly replaces wheat flour 1:1 in keto baking, artisan breads, and savory grain-free coatings without grittiness.
            </p>

            {/* Size Selector Cards */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
                Select Package Size:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['1lb', '2lb', '4lb'] as const).map((sizeKey) => {
                  const opt = sizeOptions[sizeKey];
                  const isSelected = selectedSize === sizeKey;
                  return (
                    <button
                      key={sizeKey}
                      onClick={() => setSelectedSize(sizeKey)}
                      className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#557A61] bg-[#557A61]/5 ring-1 ring-[#557A61]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      {opt.badge && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#D97757] text-white text-[9px] font-bold uppercase tracking-wider">
                          {opt.badge}
                        </span>
                      )}
                      <span className="block text-xs font-bold text-stone-900">{opt.label}</span>
                      <span className="block text-sm font-extrabold text-stone-900 mt-1">
                        ${opt.price.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">{opt.unitPrice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary & Quantity Stepper */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-extrabold text-stone-900">
                ${(currentOption.price * quantity).toFixed(2)}
              </span>
              <span className="text-stone-400 line-through text-sm">
                ${(currentOption.origPrice * quantity).toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded-md">
                Save 20%
              </span>
            </div>

            {/* Quantity Stepper & Prominent Add to Cart Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {/* Stepper */}
              <div className="flex items-center justify-between sm:justify-center border border-stone-200 rounded-xl bg-stone-50 p-1.5 min-w-[120px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease Quantity"
                  className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-90 transition-all"
                >
                  −
                </button>
                <span className="font-bold text-stone-900 text-sm px-3 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase Quantity"
                  className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-90 transition-all"
                >
                  +
                </button>
              </div>

              {/* Prominent 'Add to Cart' Button in Primary Brand Color */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-h-[50px] px-8 py-3.5 bg-[#557A61] hover:bg-[#3E5C47] active:bg-[#2D4534] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart · ${(currentOption.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Trust Signals & Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#557A61] shrink-0" />
                <span>Free 2-Day Shipping over $35</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#557A61] shrink-0" />
                <span>Certified Gluten-Free & Non-GMO</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#557A61] shrink-0" />
                <span>Resealable Stay-Fresh Foil Pouch</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#557A61] shrink-0" />
                <span>30-Day Freshness Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        BELOW THE FOLD:
        Tabbed sections for 'Detailed Description', 'Nutrition Facts', and 'Recipes Using This Product'
      */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-8 text-left">
        {/* Tab Buttons Header */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTabSection('description')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabSection === 'description'
                ? 'bg-[#557A61] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            Detailed Description
          </button>

          <button
            onClick={() => setActiveTabSection('nutrition')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabSection === 'nutrition'
                ? 'bg-[#557A61] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            Nutrition Facts
          </button>

          <button
            onClick={() => setActiveTabSection('recipes')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabSection === 'recipes'
                ? 'bg-[#557A61] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            Recipes Using This Product (3)
          </button>
        </div>

        {/* Tab 1: Detailed Description */}
        {activeTabSection === 'description' && (
          <div className="space-y-6 max-w-4xl text-stone-700 leading-relaxed text-sm sm:text-base animate-in fade-in duration-200">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                The Single-Origin California Difference
              </h3>
              <p>
                Our almond flour starts with whole nonpareil almonds nurtured in California’s sun-drenched Central Valley. Unlike commercial commodity flours that use chemical bleaching agents, our almonds are gently blanched in pure hot water to lift the skins, immediately cooled, and air-dried to protect the delicate monounsaturated fats and natural antioxidants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#557A61]" />
                  <span>Why Superfine Particle Size Matters</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Traditional coarse almond meal produces heavy, crumbly, and gritty textures. Our proprietary cold roller milling delivers a powder so fine it dissolves smoothly into delicate batters—giving you tender keto cookies, airy muffins, and fluffy grain-free pancakes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#557A61]" />
                  <span>100% Gluten-Free Dedicated Facility</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Batch-tested for gluten below 5 PPM. Free from peanuts, soy, dairy, and artificial additives. Certified Paleo, Keto, and Kosher to suit clean metabolic lifestyles.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-stone-900 text-sm mb-1">
                Storage & Freshness Advice
              </h4>
              <p className="text-xs sm:text-sm text-stone-600">
                Because our flour contains 100% natural cold-milled almonds with no preservatives, store in a cool, dry pantry for up to 6 months, or seal and refrigerate/freeze after opening to lock in fresh nutty sweetness for up to 12 months.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Nutrition Facts */}
        {activeTabSection === 'nutrition' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Authentic Nutrition Facts Label */}
            <div className="md:col-span-5 bg-white border-2 border-stone-900 p-5 rounded-2xl font-sans text-stone-900 shadow-sm max-w-sm">
              <h3 className="font-black text-2xl tracking-tighter uppercase border-b-8 border-stone-900 pb-1">
                Nutrition Facts
              </h3>
              <div className="text-xs font-semibold py-1 border-b border-stone-900">
                About 32 servings per container
              </div>
              <div className="flex justify-between items-baseline font-black text-sm py-1 border-b-4 border-stone-900">
                <span>Serving size</span>
                <span>1/4 Cup (28g)</span>
              </div>

              <div className="flex justify-between items-baseline py-2 border-b-8 border-stone-900">
                <div>
                  <span className="text-[10px] font-bold uppercase block">Amount per serving</span>
                  <span className="font-black text-3xl">Calories</span>
                </div>
                <span className="font-black text-4xl tabular-nums">160</span>
              </div>

              <div className="text-right text-[10px] font-bold border-b border-stone-300 py-1">
                % Daily Value*
              </div>

              <div className="space-y-1 text-xs divide-y divide-stone-200">
                <div className="flex justify-between py-1">
                  <span><strong>Total Fat</strong> 14g</span>
                  <strong className="tabular-nums">18%</strong>
                </div>
                <div
                  style={{ backgroundColor: '#c63030' }}
                  className="flex justify-between py-1 pl-3 text-white rounded-md px-1.5"
                >
                  <span>Saturated Fat 1g</span>
                  <span className="tabular-nums">5%</span>
                </div>
                <div className="flex justify-between py-1 pl-3 text-stone-600">
                  <span>Monounsaturated Fat 9g</span>
                  <span></span>
                </div>
                <div className="flex justify-between py-1">
                  <span><strong>Cholesterol</strong> 0mg</span>
                  <strong className="tabular-nums">0%</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span><strong>Sodium</strong> 0mg</span>
                  <strong className="tabular-nums">0%</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span><strong>Total Carbohydrate</strong> 6g</span>
                  <strong className="tabular-nums">2%</strong>
                </div>
                <div className="flex justify-between py-1 pl-3 text-stone-600">
                  <span>Dietary Fiber 3g</span>
                  <span className="tabular-nums">11%</span>
                </div>
                <div className="flex justify-between py-1 pl-3 text-stone-600">
                  <span>Total Sugars 1g</span>
                  <span></span>
                </div>
                <div
                  style={{ backgroundColor: '#027171' }}
                  className="flex justify-between py-1 border-t-4 border-stone-900 text-white rounded-md px-1.5"
                >
                  <span><strong>Protein</strong> 6g</span>
                  <strong className="tabular-nums">12%</strong>
                </div>
              </div>

              <div className="pt-3 border-t-4 border-stone-900 text-[10px] space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Vitamin E 7.3mg</span>
                  <span>50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Magnesium 75mg</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Calcium 70mg</span>
                  <span>6%</span>
                </div>
                <div className="flex justify-between">
                  <span>Iron 1mg</span>
                  <span>6%</span>
                </div>
              </div>
            </div>

            {/* Net Carbs & Allergen Note */}
            <div className="md:col-span-7 space-y-5">
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#D97757]" />
                  <h4 className="font-bold text-stone-900 text-base">Net Carbohydrate Breakdown</h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  For ketogenic and blood-sugar conscious home cooks, net carbs are calculated by subtracting dietary fiber from total carbohydrates:
                </p>
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-800">
                  <span>6g Total Carbs − 3g Dietary Fiber</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#557A61]/15 text-[#3E5C47] font-bold">
                    = 3g Net Carbs
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-stone-600">
                <h5 className="font-bold text-stone-800">Ingredients</h5>
                <p className="font-mono text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                  100% Steam-Blanched California Almonds.
                </p>
                <p className="text-xs text-stone-500 pt-1">
                  <strong>Allergen Warning:</strong> Contains tree nuts (Almonds). Packaged in a dedicated gluten-free and peanut-free certified facility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Recipes Using This Product */}
        {activeTabSection === 'recipes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-stone-900">
                  Tested Recipes Using This Almond Flour
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Chef-tested recipes formulated specifically for superfine blanched almond flour.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('recipes')}
                className="text-xs font-semibold text-[#557A61] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse all recipes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mini-Grid of 3 Related Recipe Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED_ALMOND_RECIPES.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe as any}
                  dietBadge={recipe.dietBadge}
                  rating={recipe.rating}
                  reviewsCount={recipe.reviewsCount}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

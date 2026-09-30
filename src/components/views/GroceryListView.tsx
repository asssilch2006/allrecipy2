import React, { useState } from 'react';
import {
  ShoppingBag, Check, Trash2, Plus, Share2, Printer, Copy,
  CheckCircle2, Sparkles, Utensils
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroceryItem } from '../../types';

export const GroceryListView: React.FC = () => {
  const {
    groceryList,
    toggleGroceryItem,
    removeGroceryItem,
    clearCheckedGroceryItems,
    addGroceryItem,
    showToast,
    generateGroceryListFromPlan,
  } = useApp();

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<string>('1');
  const [newItemUnit, setNewItemUnit] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('Produce');

  // Categorize items
  const categories: Record<string, GroceryItem[]> = {};

  groceryList.forEach((item) => {
    // Clean category name
    let cat = item.category || 'Pantry & Spices';
    if (cat.toLowerCase().includes('produce')) cat = 'Produce';
    else if (cat.toLowerCase().includes('dairy') || cat.toLowerCase().includes('cheese') || cat.toLowerCase().includes('egg') || cat.toLowerCase().includes('milk')) cat = 'Dairy & Eggs';
    else if (cat.toLowerCase().includes('meat') || cat.toLowerCase().includes('poultry') || cat.toLowerCase().includes('seafood') || cat.toLowerCase().includes('fish')) cat = 'Meat & Seafood';
    else if (cat.toLowerCase().includes('canned') || cat.toLowerCase().includes('jarred')) cat = 'Canned Goods';
    else if (cat.toLowerCase().includes('bakery') || cat.toLowerCase().includes('bread')) cat = 'Bakery & Grains';
    else if (cat.toLowerCase().includes('pasta') || cat.toLowerCase().includes('rice')) cat = 'Bakery & Grains';
    else if (cat.toLowerCase().includes('spice') || cat.toLowerCase().includes('oil') || cat.toLowerCase().includes('seasoning') || cat.toLowerCase().includes('condiment')) cat = 'Pantry & Spices';

    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter((i) => i.checked).length;
  const percentDone = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addGroceryItem(
      newItemName.trim(),
      parseFloat(newItemAmount) || 1,
      newItemUnit.trim(),
      newItemCategory,
      'Custom'
    );
    setNewItemName('');
    setNewItemAmount('1');
    setNewItemUnit('');
  };

  const handleCopyList = () => {
    if (groceryList.length === 0) {
      showToast('Grocery list is empty', 'info');
      return;
    }

    let text = `🛒 ALLRECIPY.COM SHOPPING LIST (${checkedItems}/${totalItems} items purchased)\n\n`;
    Object.entries(categories).forEach(([cat, items]) => {
      text += `[${cat.toUpperCase()}]\n`;
      items.forEach((item) => {
        text += `${item.checked ? '✓ [x]' : '○ [ ]'} ${item.amount > 0 ? item.amount : ''} ${item.unit || ''} ${item.name}${item.recipeSource ? ` (for ${item.recipeSource})` : ''}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    showToast('Grocery list copied to clipboard!');
  };

  const handleShare = async () => {
    if (groceryList.length === 0) return;
    const text = `allrecipy.com Shopping List:\n` + groceryList.map((i) => `- ${i.name} (${i.amount} ${i.unit})`).join('\n');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My allrecipy.com Grocery List',
          text,
        });
      } catch (e) {
        // Fallback to copy
        handleCopyList();
      }
    } else {
      handleCopyList();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Smart Shopping Assistant</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Smart Grocery List
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            Auto-categorized by supermarket aisles for fast, efficient shopping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyList}
            className="min-h-[40px] px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy text to clipboard"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>

          <button
            onClick={handleShare}
            className="min-h-[40px] px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Share shopping list"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="min-h-[40px] px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Print shopping list"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={() => generateGroceryListFromPlan()}
            className="min-h-[40px] px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync with Planner</span>
          </button>
        </div>
      </div>

      {/* Progress & Stat Bar */}
      {totalItems > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs tabular-nums">
              {percentDone}%
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                {checkedItems} of {totalItems} items checked off
              </span>
              <span className="text-[11px] text-stone-400">
                {totalItems - checkedItems} remaining to purchase
              </span>
            </div>
          </div>

          {checkedItems > 0 && (
            <button
              onClick={clearCheckedGroceryItems}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline self-end sm:self-auto"
            >
              Clear Checked Items
            </button>
          )}
        </div>
      )}

      {/* Add Custom Item Quick Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Quick Add Item</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g. Greek yogurt, sourdough bread)..."
            className="sm:col-span-6 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="text"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Qty (e.g. 2)"
            className="sm:col-span-2 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:outline-none text-center"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="sm:col-span-3 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="Produce">Produce</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Meat & Seafood">Meat & Seafood</option>
            <option value="Bakery & Grains">Bakery & Grains</option>
            <option value="Pantry & Spices">Pantry & Spices</option>
            <option value="Canned Goods">Canned Goods</option>
          </select>
          <button
            type="submit"
            className="sm:col-span-1 min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center shadow-xs"
          >
            Add
          </button>
        </div>
      </form>

      {/* Categorized List */}
      {totalItems > 0 ? (
        <div className="space-y-6">
          {Object.entries(categories).map(([categoryName, items]) => (
            <div
              key={categoryName}
              className="bg-white border border-stone-200/90 rounded-3xl p-5 md:p-6 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{categoryName}</span>
                </h3>
                <span className="text-xs text-stone-400 font-medium tabular-nums">
                  {items.length} items
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleGroceryItem(item.id)}
                    className="py-3 flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          item.checked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-white group-hover:border-emerald-500'
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`text-xs block truncate ${
                            item.checked
                              ? 'line-through text-stone-400'
                              : 'text-stone-800 font-medium'
                          }`}
                        >
                          <span className="font-semibold">{item.amount > 0 ? item.amount : ''} {item.unit}</span>{' '}
                          {item.name}
                        </span>

                        {item.recipeSource && (
                          <span className="text-[10px] text-stone-400 block truncate">
                            For: {item.recipeSource}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGroceryItem(item.id);
                      }}
                      className="text-stone-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-stone-200 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-stone-800 text-base">Your grocery list is empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add items manually above, or sync automatically with recipes in your Weekly Meal Planner!
            </p>
          </div>
          <button
            onClick={() => generateGroceryListFromPlan()}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Pull Ingredients from Weekly Plan
          </button>
        </div>
      )}
    </div>
  );
};

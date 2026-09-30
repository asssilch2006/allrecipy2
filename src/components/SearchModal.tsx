import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Flame, Clock, Sparkles, Tag, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchRecipes } from '../services/api';
import { RecipeSummary } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, openRecipeDetails } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const TRENDING_TAGS = [
    { label: 'Mediterranean Bowls', query: 'Mediterranean Bowl' },
    { label: 'Quick 20-Min Dinners', query: 'Quick Dinner' },
    { label: 'Avocado & Salmon', query: 'Salmon Avocado' },
    { label: 'High Protein Salad', query: 'High Protein Salad' },
    { label: 'Gluten-Free Oats', query: 'Oatmeal' },
    { label: 'Plant-Based Curries', query: 'Chickpea Curry' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchRecipes({ query: query.trim(), number: 6 });
        setResults(data.results || []);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectRecipe = (id: number) => {
    openRecipeDetails(id);
    onClose();
  };

  const handleSearchAll = () => {
    setActiveTab('recipes');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-150">
          <Search className="w-5 h-5 text-[#4A5568] shrink-0 stroke-[1.8]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchAll()}
            placeholder="Search healthy recipes, ingredients (e.g. salmon, quinoa, kale)..."
            className="flex-1 bg-transparent border-none text-[#1A202C] placeholder:text-[#4A5568] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#4A5568] hover:text-[#1A202C] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-[#1A202C] hover:text-black bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 custom-scrollbar flex-1">
          {/* Trending Searches when input is empty */}
          {!query && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3748] uppercase tracking-wider mb-3">
                <Tag className="w-3.5 h-3.5 text-[#8A9A5B]" />
                <span>Popular Healthy Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => setQuery(tag.query)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-[#F4F6F0] text-[#1A202C] hover:text-[#4A5531] hover:border-[#8A9A5B]/40 border border-stone-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Suggestion Box */}
              <div className="p-4 rounded-2xl bg-[#F4F6F0] border border-stone-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8A9A5B] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A202C]">Nutrition-Focused Discovery</h4>
                  <p className="text-xs text-[#2D3748] mt-0.5 leading-relaxed font-medium">
                    Search by dietary preference like <span className="font-bold text-[#1A202C]">"high protein"</span>, <span className="font-bold text-[#1A202C]">"under 30 mins"</span>, or specific clean ingredients.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center text-[#2D3748] gap-2 font-medium">
              <div className="w-6 h-6 border-2 border-[#8A9A5B] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">Searching 300,000+ healthy recipes...</span>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#2D3748] uppercase tracking-wider mb-3">
                <span>Matching Recipes ({results.length})</span>
                <button
                  onClick={handleSearchAll}
                  className="text-[#4A5531] hover:text-[#2D3748] font-bold normal-case flex items-center gap-1"
                >
                  View all results
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl border border-stone-200 hover:border-[#8A9A5B] hover:bg-[#F4F6F0] transition-all text-left group"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#1A202C] truncate group-hover:text-[#4A5531] transition-colors">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#2D3748] font-medium">
                        {recipe.readyInMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#4A5568]" />
                            {recipe.readyInMinutes} min
                          </span>
                        )}
                        {recipe.calories && (
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#E2725B]" />
                            {recipe.calories} kcal
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center">
              <UtensilsCrossed className="w-8 h-8 text-[#4A5568] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1A202C]">No exact matches found</p>
              <p className="text-xs text-[#2D3748] mt-1 font-medium">
                Try searching for common ingredients like garlic, lemon, quinoa, or salmon.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-[#2D3748] font-medium">
          <span>Search healthy recipes, ingredients & clean meal ideas</span>
          <button
            onClick={handleSearchAll}
            className="font-bold text-[#4A5531] hover:text-[#1A202C] flex items-center gap-1"
          >
            Go to Recipe Explorer
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ChefHat, RefreshCw, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askAiChef } from '../services/api';
import { ChatMessage } from '../types';

export const AiChefDrawer: React.FC = () => {
  const { isAiChefOpen, setAiChefOpen, selectedRecipe } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour! I am Chef Auguste, your personal AI culinary director on allrecipy.com. Ask me about ingredient substitutions, wine pairings, technique guidance, or meal prep hacks!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiChefOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiChefOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const recipeContext = selectedRecipe
        ? {
            title: selectedRecipe.title,
            ingredients: selectedRecipe.extendedIngredients?.map((i) => i.name) || [],
          }
        : undefined;

      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const res = await askAiChef(text, recipeContext, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I ran into a quick snag in the kitchen, but here's a reliable tip: remember to taste and balance salt, acidity, and fat at every step! What else can I help with?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = selectedRecipe
    ? [
        `Wine pairing for this recipe?`,
        `Healthy ingredient swaps?`,
        `How do I prep this ahead?`,
        `How do I know when it's done?`,
      ]
    : [
        `What can I make with chicken & zucchini?`,
        `How do I substitute buttermilk?`,
        `Best way to fix an overly salty soup?`,
        `Tips for searing wild salmon crispy?`,
      ];

  if (!isAiChefOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setAiChefOpen(false)}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Sheet Panel */}
      <div
        style={{ backgroundColor: '#c63030' }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-stone-900 text-sm">Chef Auguste</h2>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  AI Cooking Assistant
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {selectedRecipe ? `Advising on: ${selectedRecipe.title.slice(0, 28)}...` : 'Ask any culinary question'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiChefOpen(false)}
            aria-label="Close Chef Assistant"
            className="w-10 h-10 rounded-xl hover:bg-stone-200/60 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Recipe Context Banner if active */}
        {selectedRecipe && (
          <div className="bg-emerald-50/70 border-b border-emerald-100/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-900">
            <span className="truncate max-w-[320px]">
              Active Dish: <span className="font-semibold">{selectedRecipe.title}</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Context Active</span>
          </div>
        )}

        {/* Messages Body */}
        <div
          style={{ backgroundColor: '#91abb2' }}
          className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar"
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                    <ChefHat className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-stone-100 text-stone-800 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-stone-400 text-xs">
              <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
                <ChefHat className="w-3.5 h-3.5" />
              </div>
              <div className="bg-stone-100 rounded-2xl px-4 py-2.5 flex items-center gap-1.5 text-stone-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Chef Auguste is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-stone-700 rounded-full font-medium transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Chef Auguste anything..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-stone-100 border border-stone-200 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <button
              style={{ backgroundColor: '#296b3d' }}
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="min-h-[44px] min-w-[44px] hover:brightness-110 active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl flex items-center justify-center transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

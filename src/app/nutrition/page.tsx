'use client';

import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Sparkles, 
  RefreshCw, 
  ShoppingBag, 
  Clock, 
  Check, 
  Copy, 
  X, 
  ChefHat,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getStoredProfile, getStoredMealPlan, saveStoredMealPlan } from '@/utils/storage';
import { computeBiometrics } from '@/utils/biometrics';
import { MealPlan, Recipe, UserProfile, Ingredient } from '@/types';
import BiometricsCard from '@/components/biometrics/BiometricsCard';

export default function NutritionPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [swappingMealId, setSwappingMealId] = useState<string | null>(null);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);

    const storedPlan = getStoredMealPlan();
    if (storedPlan) {
      setMealPlan(storedPlan);
    } else if (prof) {
      fetchMealPlan(prof);
    }
  }, []);

  const biometrics = profile ? computeBiometrics(profile) : null;

  const fetchMealPlan = async (prof: UserProfile) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: prof })
      });
      const data = await res.json();
      if (data.success && data.mealPlan) {
        setMealPlan(data.mealPlan);
        saveStoredMealPlan(data.mealPlan);
      }
    } catch (e) {
      console.error('Failed to generate meal plan', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapMeal = async (recipe: Recipe) => {
    if (!profile) return;
    setSwappingMealId(recipe.id);
    try {
      const res = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          swapMealType: recipe.mealType,
          targetMacros: {
            calories: recipe.calories,
            protein: recipe.proteinGrams,
            carbs: recipe.carbsGrams,
            fat: recipe.fatGrams
          }
        })
      });
      const data = await res.json();
      if (data.success && data.meal && mealPlan) {
        const updatedMeals = mealPlan.meals.map(m => m.id === recipe.id ? data.meal : m);
        const updatedPlan = { ...mealPlan, meals: updatedMeals };
        setMealPlan(updatedPlan);
        saveStoredMealPlan(updatedPlan);
      }
    } catch (e) {
      console.error('Failed to swap meal', e);
    } finally {
      setSwappingMealId(null);
    }
  };

  const toggleCheckIngredient = (key: string) => {
    setCheckedIngredients(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCategorizedGrocery = (): Record<string, Ingredient[]> => {
    if (!mealPlan) return {};
    const categories: Record<string, Ingredient[]> = {
      'Produce': [],
      'Protein & Meat': [],
      'Dairy & Eggs': [],
      'Pantry & Spices': [],
      'Grains & Bakery': [],
      'Other': []
    };

    mealPlan.meals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        const cat = ing.category || 'Other';
        if (!categories[cat]) categories[cat] = [];
        // Avoid duplicate items
        if (!categories[cat].some(i => i.item.toLowerCase() === ing.item.toLowerCase())) {
          categories[cat].push(ing);
        }
      });
    });

    return categories;
  };

  const copyGroceryListText = () => {
    const categories = getCategorizedGrocery();
    let text = `🛒 FitMind AI Weekly Grocery Checklist:\n\n`;
    Object.entries(categories).forEach(([cat, items]) => {
      if (items.length > 0) {
        text += `--- ${cat.toUpperCase()} ---\n`;
        items.forEach(i => {
          text += `• ${i.item} (${i.amount})\n`;
        });
        text += `\n`;
      }
    });
    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-nutrition-400" />
            AI Diet & Meal Planner
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Precision micro-tailored meals matched to your daily macro distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => profile && fetchMealPlan(profile)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-nutrition-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Regenerate Full Plan'}</span>
          </button>

          <button
            onClick={() => setShowGroceryModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-nutrition-500 to-nutrition-600 hover:opacity-95 text-slate-950 text-xs font-extrabold shadow-md shadow-nutrition-500/20 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Grocery List</span>
          </button>
        </div>
      </div>

      {/* Biometrics Summary */}
      {profile && biometrics && (
        <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
          <BiometricsCard biometrics={biometrics} profile={profile} />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <ChefHat className="w-12 h-12 text-nutrition-400 animate-bounce mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Coach AI is Crafting Your Custom Meals...</h3>
          <p className="text-xs text-slate-400 mt-1">Calculating exact caloric density, recipes, and prep times.</p>
        </div>
      )}

      {/* Recipe Cards List */}
      {!loading && mealPlan && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Daily Meal Breakdown (4 Meals)</h2>
            <span className="text-xs text-nutrition-400 font-medium">
              Total: {mealPlan.meals.reduce((acc, m) => acc + m.calories, 0)} kcal
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {mealPlan.meals.map((recipe) => {
              const isSwapping = swappingMealId === recipe.id;
              const isExpanded = expandedRecipeId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  className="glass-card rounded-3xl p-6 border border-slate-800/80 hover:border-nutrition-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-nutrition-500/10 text-nutrition-400 border border-nutrition-500/20">
                          {recipe.mealType}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Prep: {recipe.prepTimeMinutes}m | Cook: {recipe.cookTimeMinutes}m
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mt-2">{recipe.name}</h3>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      {/* Macro Pill Badges */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-semibold">
                          <strong className="text-white">{recipe.calories}</strong> kcal
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-nutrition-500/10 text-nutrition-400 border border-nutrition-500/20 font-semibold">
                          <strong>{recipe.proteinGrams}g</strong> P
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-workout-500/10 text-workout-400 border border-workout-500/20 font-semibold">
                          <strong>{recipe.carbsGrams}g</strong> C
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          <strong>{recipe.fatGrams}g</strong> F
                        </span>
                      </div>

                      {/* Swap Meal Button */}
                      <button
                        onClick={() => handleSwapMeal(recipe)}
                        disabled={isSwapping}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-nutrition-400 transition-colors disabled:opacity-50"
                        title="Swap dish for alternative macro match"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSwapping ? 'animate-spin text-nutrition-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Recipe Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Ingredients list */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Ingredients Required</h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                            <span>{ing.item}</span>
                            <span className="font-semibold text-nutrition-400">{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prep Instructions */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Preparation Steps</h4>
                      <ol className="space-y-2 text-xs text-slate-300">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-nutrition-500/20 text-nutrition-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {recipe.tips && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
                          💡 <strong>Pro Tip:</strong> {recipe.tips}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grocery List Modal */}
      {showGroceryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl rounded-3xl p-6 border border-slate-800 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-nutrition-400" />
                <h3 className="text-lg font-bold text-white">Organized Weekly Grocery List</h3>
              </div>
              <button
                onClick={() => setShowGroceryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-5 pr-2">
              {Object.entries(getCategorizedGrocery()).map(([cat, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <h4 className="text-xs font-bold text-nutrition-400 uppercase tracking-wider mb-2">{cat}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((ing) => {
                        const key = `${cat}_${ing.item}`;
                        const checked = !!checkedIngredients[key];
                        return (
                          <div
                            key={key}
                            onClick={() => toggleCheckIngredient(key)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              checked
                                ? 'bg-slate-950/60 border-slate-800/40 text-slate-500 line-through'
                                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-nutrition-500/50'
                            }`}
                          >
                            <span className="font-medium">{ing.item}</span>
                            <span className="text-[11px] text-nutrition-400">{ing.amount}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <p className="text-xs text-slate-400">Click items to check off while shopping.</p>
              <button
                onClick={copyGroceryListText}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nutrition-500 hover:bg-nutrition-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-nutrition-500/20"
              >
                {copiedGrocery ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedGrocery ? 'Copied to Clipboard!' : 'Export Grocery List'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

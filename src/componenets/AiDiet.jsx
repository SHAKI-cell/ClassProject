import { useState } from "react";
import { generateDietPlan } from "../geminiService";

const CHIPS = ["Weight loss", "Muscle gain", "Keto", "Vegan", "High protein"];

const MEAL_STYLES = {
  Breakfast: { bg: "#EAF3DE", tc: "#3B6D11", emoji: "🥑" },
  Lunch:     { bg: "#FAEEDA", tc: "#854F0B", emoji: "🍗" },
  Snack:     { bg: "#EEEDFE", tc: "#534AB7", emoji: "🫐" },
  Dinner:    { bg: "#E6F1FB", tc: "#185FA5", emoji: "🐟" },
};

export default function AiDiet({ onAddMeal }) {
  const [query, setQuery] = useState("");
  const [aiMeals, setAiMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(new Set());

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const meals = await generateDietPlan(query);
    setAiMeals(meals);
    setLoading(false);
  };

  const handleAdd = (meal, i) => {
    if (added.has(i)) return;
    onAddMeal(meal);
    setAdded((prev) => new Set([...prev, i]));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200
        text-gray-400 text-[11px] font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        AI powered
      </div>

      <h2 className="text-lg font-medium text-gray-900 mb-1">Diet planner</h2>
      <p className="text-sm text-gray-400 mb-5">
        Describe your goal and get a personalised meal plan
      </p>

      {/* Input */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🎯</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="e.g. weight loss, muscle gain, keto…"
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800
            placeholder:text-gray-300 outline-none focus:border-violet-300 focus:ring-2
            focus:ring-violet-100 transition-all"
        />
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setQuery(chip.toLowerCase())}
            className="bg-gray-50 border border-gray-200 text-gray-500 text-xs px-3 py-1.5
              rounded-full hover:border-gray-400 hover:text-gray-700 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm
          py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100
          hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Generating…
          </>
        ) : (
          aiMeals.length ? "Regenerate plan" : "Generate my plan"
        )}
      </button>

      {/* Results */}
      {aiMeals.length > 0 && (
        <>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-300 font-medium tracking-widest uppercase">
              Your plan
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            {aiMeals.map((meal, i) => {
              const s = MEAL_STYLES[meal.type] ?? MEAL_STYLES.Snack;
              const isAdded = added.has(i);
              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: s.bg }}
                    >
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-medium tracking-widest uppercase mb-0.5"
                        style={{ color: s.tc }}
                      >
                        {meal.type}
                      </div>
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {meal.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-[11px] text-gray-400">
                    <span>Cal <span className="text-gray-700 font-medium">{meal.calories}</span></span>
                    <span>Protein <span className="text-gray-700 font-medium">{meal.protein}g</span></span>
                  </div>

                  <button
                    onClick={() => handleAdd(meal, i)}
                    className={`self-end w-7 h-7 rounded-lg border text-sm flex items-center justify-center
                      transition-all ${
                        isAdded
                          ? "bg-green-50 border-green-200 text-green-500"
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
                      }`}
                  >
                    {isAdded ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!aiMeals.length && !loading && (
        <p className="text-center text-gray-300 text-sm pt-6 pb-2">
          Your personalised meals will appear here
        </p>
      )}
    </div>
  );
}
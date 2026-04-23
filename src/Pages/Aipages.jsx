import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebase";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AiDiet from '../componenets/AiDiet';
import Layout from '../Layout/Layout';

const Aipages = () => {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        fetchPlans(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔥 Fetch saved plans
  const fetchPlans = async (uid) => {
    try {
      const ref = collection(db, "users", uid, "dietPlans");
      const snapshot = await getDocs(ref);
      const plans = snapshot.docs.map((doc) => doc.data());
      // Sort plans by date descending
      plans.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSavedPlans(plans);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMealFromAI = (meal) => {
    // Add to current selection buffer
    setMeals((prev) => [...prev, { ...meal, quantity: meal.quantity || 100 }]);
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const saveDietPlan = async () => {
    if (!user) return alert("Please login to save your plan");
    if (!date) return alert("Please select a date first");
    if (meals.length === 0) return alert("Add at least one meal from the AI recommendations");

    setLoading(true);
    try {
      const ref = doc(db, "users", user.uid, "dietPlans", date);
      const existingSnap = await getDoc(ref);
      
      let existingMeals = [];
      if (existingSnap.exists()) {
        existingMeals = existingSnap.data().meals || [];
      }
      
      const updatedMeals = [...existingMeals, ...meals];
      const totals = updatedMeals.reduce((acc, m) => {
        acc.calories += (m.calories || 0);
        acc.protein += (m.protein || 0);
        acc.fat += (m.fat || 0);
        acc.carbs += (m.carbs || 0);
        return acc;
      }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

      await setDoc(ref, {
        date,
        meals: updatedMeals,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalFat: totals.fat,
        totalCarbs: totals.carbs,
        createdAt: existingSnap.exists() ? existingSnap.data().createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      alert("✅ Diet plan saved successfully!");
      setMeals([]);
      fetchPlans(user.uid);
    } catch (err) {
      console.error(err);
      alert("Error saving diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-12 px-4 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-900 mb-2 font-serif">AI Smart Planner</h1>
            <p className="text-gray-500">Get AI recommendations and build your daily diet plan</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: AI Planner */}
            <div className="lg:col-span-2">
              <AiDiet onAddMeal={handleAddMealFromAI} />
            </div>

            {/* Right: Current Selection & Date */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📅</span> Set Date
                </h2>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-6 focus:ring-2 focus:ring-green-100 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span>🍱</span> Selected Meals ({meals.length})
                </h2>
                
                {meals.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl mb-6">
                    <p className="text-sm text-gray-400">No meals added yet.<br/>Click '+' on AI recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                    {meals.map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{m.type}</p>
                        </div>
                        <button 
                          onClick={() => removeMeal(i)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={saveDietPlan}
                  disabled={loading || meals.length === 0}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all disabled:bg-gray-200 disabled:shadow-none"
                >
                  {loading ? "Saving..." : "Save Daily Plan"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: Saved History (Card Format) */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm">📊</span>
              Your Saved Diet Plans
            </h2>

            {savedPlans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                <p>You haven't saved any plans yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map((plan, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <span className="font-bold text-gray-700">📅 {plan.date}</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">
                        {plan.meals?.length || 0} Meals
                      </span>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Cal</p>
                          <p className="text-sm font-bold text-orange-600">{Math.round(plan.totalCalories)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Pro</p>
                          <p className="text-sm font-bold text-blue-600">{Math.round(plan.totalProtein)}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Fat</p>
                          <p className="text-sm font-bold text-red-600">{Math.round(plan.totalFat)}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Carb</p>
                          <p className="text-sm font-bold text-green-700">{Math.round(plan.totalCarbs)}g</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {plan.meals?.slice(0, 4).map((m, j) => (
                          <div key={j} className="flex justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                            <span className="text-gray-600 truncate mr-2"><span className="font-bold text-gray-400 mr-1">{m.type[0].toUpperCase()}</span> {m.name}</span>
                            <span className="text-gray-400 flex-shrink-0">{m.calories} kcal</span>
                          </div>
                        ))}
                        {plan.meals?.length > 4 && (
                          <p className="text-[10px] text-gray-300 text-center mt-2">+ {plan.meals.length - 4} more meals</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Aipages;

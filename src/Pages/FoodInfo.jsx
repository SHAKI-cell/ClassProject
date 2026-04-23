import React, { useState } from "react";
import Layout from "../Layout/Layout";

const API_KEY = "K24eycEZLdVlKugLWCm9eon9K6GaWuUxUxi9OrzV";

const FoodInfo = () => {
  const [query, setQuery] = useState("");
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFood = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&dataType=Foundation,SR%20Legacy&pageSize=1&api_key=${API_KEY}`
      );

      const data = await res.json();

      if (!data.foods || data.foods.length === 0) {
        alert("No food found");
        setFood(null);
      } else {
        setFood(data.foods[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    }

    setLoading(false);
  };

  const getNutrient = (name) => {
    const n = food?.foodNutrients?.find((nut) =>
      nut.nutrientName.toLowerCase().includes(name)
    );
    return n ? `${n.value} ${n.unitName}` : "N/A";
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .fi-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: #f0f4f1;
        }

        /* ── Decorative background ── */
        .fi-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        /* mesh gradient base */
        .fi-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(45,106,79,0.13) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 10%, rgba(224,160,48,0.11) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 80% 90%, rgba(82,183,136,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(224,160,48,0.08) 0%, transparent 50%),
            linear-gradient(160deg, #e8f5ed 0%, #f5f7f4 40%, #fef9ec 100%);
        }
        /* floating circles */
        .fi-circle {
          position: absolute;
          border-radius: 50%;
          animation: fiFloat linear infinite;
        }
        .fi-c1 { width:320px;height:320px;top:-80px;left:-80px;background:rgba(45,106,79,0.06);animation-duration:18s; }
        .fi-c2 { width:200px;height:200px;top:30%;right:-60px;background:rgba(224,160,48,0.08);animation-duration:14s;animation-delay:-4s; }
        .fi-c3 { width:140px;height:140px;bottom:15%;left:5%;background:rgba(82,183,136,0.07);animation-duration:20s;animation-delay:-9s; }
        .fi-c4 { width:260px;height:260px;bottom:-60px;right:10%;background:rgba(45,106,79,0.05);animation-duration:16s;animation-delay:-6s; }
        .fi-c5 { width:90px;height:90px;top:55%;left:40%;background:rgba(224,160,48,0.07);animation-duration:12s;animation-delay:-2s; }

        @keyframes fiFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          33%      { transform: translateY(-18px) scale(1.03); }
          66%      { transform: translateY(10px) scale(0.97); }
        }

        /* food emoji deco */
        .fi-deco-emoji {
          position: absolute;
          font-size: 48px;
          opacity: 0.07;
          animation: fiSpin linear infinite;
          user-select: none;
        }
        .fi-e1 { top: 8%; left: 4%; animation-duration: 30s; }
        .fi-e2 { top: 20%; right: 6%; animation-duration: 22s; font-size: 36px; }
        .fi-e3 { bottom: 25%; left: 8%; animation-duration: 35s; font-size: 40px; }
        .fi-e4 { bottom: 10%; right: 5%; animation-duration: 28s; font-size: 42px; }
        .fi-e5 { top: 55%; left: 55%; animation-duration: 40s; font-size: 32px; }

        @keyframes fiSpin {
          from { transform: rotate(0deg) translateY(0); }
          50%  { transform: rotate(180deg) translateY(-12px); }
          to   { transform: rotate(360deg) translateY(0); }
        }

        /* dot grid pattern */
        .fi-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(45,106,79,0.15) 1px, transparent 1px);
          background-size: 36px 36px;
          opacity: 0.5;
        }

        /* ── Content ── */
        .fi-content {
          position: relative;
          z-index: 1;
          padding: 60px 20px 80px;
          max-width: 640px;
          margin: 0 auto;
        }

        /* header */
        .fi-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fiFadeUp 0.7s ease both;
        }
        @keyframes fiFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fi-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(45,106,79,0.1);
          border: 1px solid rgba(45,106,79,0.2);
          color: #2d6a4f;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 50px;
          margin-bottom: 18px;
        }
        .fi-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #e0a030;
          animation: fiPulse 2s ease-in-out infinite;
        }
        @keyframes fiPulse {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.5); opacity:0.5; }
        }
        .fi-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #1a2a1e;
          line-height: 1.15;
          margin-bottom: 10px;
        }
        .fi-title .fi-gold { color: #e0a030; }
        .fi-subtitle {
          font-size: 15px;
          color: #5a7060;
          font-weight: 300;
        }

        /* search card */
        .fi-search-wrap {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(45,106,79,0.15);
          border-radius: 24px;
          padding: 28px 28px 24px;
          box-shadow: 0 8px 40px rgba(45,106,79,0.08), 0 1px 0 rgba(255,255,255,0.8) inset;
          margin-bottom: 28px;
          animation: fiFadeUp 0.8s 0.15s ease both;
        }
        .fi-search-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #2d6a4f;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fi-search-label::before {
          content: '';
          width: 20px; height: 2px;
          background: #e0a030;
        }
        .fi-search-row {
          display: flex;
          gap: 12px;
        }
        .fi-input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 50px;
          border: 1.5px solid rgba(45,106,79,0.2);
          background: #f8faf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1a2a1e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fi-input:focus {
          border-color: #2d6a4f;
          box-shadow: 0 0 0 3px rgba(45,106,79,0.1);
          background: #fff;
        }
        .fi-input::placeholder { color: #9ab0a2; }
        .fi-btn {
          background: linear-gradient(135deg, #2d6a4f, #3a8a65);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(45,106,79,0.3);
        }
        .fi-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,106,79,0.35);
          background: linear-gradient(135deg, #255c42, #2d6a4f);
        }
        .fi-btn:active { transform: translateY(0); }

        /* result card */
        .fi-result {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(45,106,79,0.12);
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 12px 48px rgba(45,106,79,0.1), 0 1px 0 rgba(255,255,255,0.8) inset;
          animation: fiFadeUp 0.5s ease both;
        }
        .fi-food-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a2a1e;
          margin-bottom: 6px;
          text-transform: capitalize;
        }
        .fi-food-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #2d6a4f;
          background: rgba(45,106,79,0.08);
          border: 1px solid rgba(45,106,79,0.15);
          padding: 4px 12px;
          border-radius: 50px;
          margin-bottom: 24px;
        }
        .fi-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(45,106,79,0.15), transparent);
          margin-bottom: 24px;
        }

        .fi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .fi-nutrient-card {
          border-radius: 18px;
          padding: 20px 18px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .fi-nutrient-card:hover { transform: translateY(-3px); }
        .fi-nutrient-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
        }

        .fi-nc-calories  { background: linear-gradient(135deg,#e8f4ff,#d6eaff); }
        .fi-nc-calories::before  { background: linear-gradient(90deg,#5ba4e8,#3a82d0); }

        .fi-nc-protein   { background: linear-gradient(135deg,#fff0e6,#ffe0cc); }
        .fi-nc-protein::before   { background: linear-gradient(90deg,#e08030,#c8681a); }

        .fi-nc-carbs     { background: linear-gradient(135deg,#fffbe6,#fff4cc); }
        .fi-nc-carbs::before     { background: linear-gradient(90deg,#e0c030,#c8a018); }

        .fi-nc-fat       { background: linear-gradient(135deg,#fef0f0,#fddcdc); }
        .fi-nc-fat::before       { background: linear-gradient(90deg,#e05050,#c83838); }

        .fi-n-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #5a7060;
          margin-bottom: 8px;
        }
        .fi-n-value {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1a2a1e;
          line-height: 1;
        }
        .fi-n-icon {
          font-size: 22px;
          margin-bottom: 6px;
          display: block;
        }

        .fi-footnote {
          font-size: 11px;
          color: #9ab0a2;
          text-align: center;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        /* tips row below */
        .fi-tips {
          display: flex;
          gap: 10px;
          margin-top: 28px;
          animation: fiFadeUp 0.8s 0.3s ease both;
        }
        .fi-tip {
          flex: 1;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(45,106,79,0.1);
          border-radius: 16px;
          padding: 14px 12px;
          text-align: center;
          font-size: 12px;
          color: #5a7060;
          font-weight: 400;
          line-height: 1.5;
        }
        .fi-tip strong {
          display: block;
          font-size: 18px;
          margin-bottom: 4px;
        }
      `}</style>

      <div className="fi-page">
        {/* Background layer */}
        <div className="fi-bg">
          <div className="fi-dots" />
          <div className="fi-circle fi-c1" />
          <div className="fi-circle fi-c2" />
          <div className="fi-circle fi-c3" />
          <div className="fi-circle fi-c4" />
          <div className="fi-circle fi-c5" />
          <div className="fi-deco-emoji fi-e1">🥦</div>
          <div className="fi-deco-emoji fi-e2">🍊</div>
          <div className="fi-deco-emoji fi-e3">🥑</div>
          <div className="fi-deco-emoji fi-e4">🍇</div>
          <div className="fi-deco-emoji fi-e5">🌾</div>
        </div>

        {/* Content */}
        <div className="fi-content">

          {/* Header */}
          <div className="fi-header">
            <div className="fi-badge">
              <span className="fi-badge-dot" />
              Powered by USDA
            </div>
            <h1 className="fi-title">
              Food <span className="fi-gold">Nutrition</span> Info
            </h1>
            <p className="fi-subtitle">Search any food to get instant nutritional breakdown</p>
          </div>

          {/* Search */}
          <div className="fi-search-wrap">
            <div className="fi-search-label">Search Food</div>
            <div className="fi-search-row">
              <input
                className="fi-input"
                placeholder="banana, rice, chicken..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchFood()}
              />
              <button className="fi-btn" onClick={fetchFood}>
                {loading ? "⏳" : "Search →"}
              </button>
            </div>
          </div>

          {/* Result */}
          {food && (
            <div className="fi-result">
              <div className="fi-food-name">{food.description}</div>
              <div className="fi-food-tag">✅ Verified Data</div>
              <div className="fi-divider" />

              <div className="fi-grid">
                <div className="fi-nutrient-card fi-nc-calories">
                  <span className="fi-n-icon">🔥</span>
                  <div className="fi-n-label">Calories</div>
                  <div className="fi-n-value">{getNutrient("energy")}</div>
                </div>
                <div className="fi-nutrient-card fi-nc-protein">
                  <span className="fi-n-icon">💪</span>
                  <div className="fi-n-label">Protein</div>
                  <div className="fi-n-value">{getNutrient("protein")}</div>
                </div>
                <div className="fi-nutrient-card fi-nc-carbs">
                  <span className="fi-n-icon">🌾</span>
                  <div className="fi-n-label">Carbs</div>
                  <div className="fi-n-value">{getNutrient("carbohydrate")}</div>
                </div>
                <div className="fi-nutrient-card fi-nc-fat">
                  <span className="fi-n-icon">🫙</span>
                  <div className="fi-n-label">Fat</div>
                  <div className="fi-n-value">{getNutrient("fat")}</div>
                </div>
              </div>

              <p className="fi-footnote">📊 Values are per 100g (approx) · Source: USDA FoodData Central</p>
            </div>
          )}

          {/* Tips row */}
          {!food && !loading && (
            <div className="fi-tips">
              <div className="fi-tip"><strong>🥗</strong>Try "spinach" or "oats"</div>
              <div className="fi-tip"><strong>🍗</strong>Search "chicken breast"</div>
              <div className="fi-tip"><strong>🍌</strong>Or try "banana"</div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default FoodInfo;

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable if available, otherwise fallback
export const generateDietPlan = async (userInput) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Debug log (Safe: only shows first/last 4 chars)
  // console.log("Gemini API Key Loaded:", apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "NOT FOUND");

  if (!apiKey || apiKey === "YOUR_NEW_API_KEY_HERE") {
    alert("API Key not found! Please check your .env file and RESTART your dev server (Ctrl+C then npm run dev).");
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a nutrition expert.

    Create a 1-day diet plan for: ${userInput}

    Rules:
    - Return ONLY valid array JSON
    - Include breakfast, lunch, dinner, snack
    - Include calories, protein, carbs, fat
    - DO NOT include any other text or markdown formatting outside of the JSON array.

    Format required:
    [
      {
        "type": "breakfast",
        "name": "Oats",
        "calories": 200,
        "protein": 10,
        "carbs": 30,
        "fat": 5
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // clean response (remove markdown blocks if present)
    text = text.replace(/```json/gi, "");
    text = text.replace(/```/g, "");

    return JSON.parse(text.trim());

  } catch (err) {
    console.error("Gemini API Error:", err);
    alert("AI Error: " + err.message);
    return [];
  }
};
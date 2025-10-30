import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use Azure's dynamic port
const PORT = process.env.PORT || 3000;

// 🔑 Gemini API key
const GEMINI_API_KEY = "AIzaSyAIoPF4uTyHMOnf5rCg-j61B3riY229vhA";

// ✅ Model and API endpoint
const MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.get("/", (req, res) => {
  res.send("🚀 Mental Health Chatbot is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const userText = req.body.message || "";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userText }] }],
      }),
    });

    const data = await response.json();
    console.log("📦 Gemini API response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ reply: "Error calling Gemini API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

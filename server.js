import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Setup static file serving (for your index.html and script.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// ✅ Gemini API details
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = "AIzaSyAIoPF4uTyHMOnf5rCg-j61B3riY229vhA";
const MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ✅ Chat endpoint
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
    console.log("📦 Full Gemini API response:\n", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ reply: "Error calling Gemini API." });
  }
});

// ✅ Default route (serves index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

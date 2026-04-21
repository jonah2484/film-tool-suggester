require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Film Tool Suggester API is running" });
});

// Main analysis endpoint
app.post("/api/analyze", async (req, res) => {
  const { script } = req.body;

  if (!script || script.trim().length < 30) {
    return res.status(400).json({ error: "Please provide a script of at least a few lines." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  const prompt = `You are a film production consultant and AI tools expert. Analyze the following script excerpt and return ONLY a valid JSON object (no markdown, no explanation, no code fences) with this exact structure:

{
  "genre": ["genre1", "genre2"],
  "mood": ["mood1", "mood2"],
  "features": ["visual feature 1", "visual feature 2", "visual feature 3"],
  "summary": "One sentence about what production needs this script requires.",
  "tools": [
    {
      "name": "Tool Name",
      "category": "AI Generation|Video Editing|Audio & Music|VFX & Motion|Collaboration",
      "description": "How this specific tool helps for this script in one sentence.",
      "url": "https://toolwebsite.com",
      "relevance": "high|medium"
    }
  ]
}

Suggest 10-12 tools total. Mix these categories:
- AI Generation: Runway, Pika Labs, Kling AI, Midjourney, Adobe Firefly, Stable Diffusion, Sora
- Video Editing: DaVinci Resolve, Adobe Premiere Pro, CapCut, Final Cut Pro
- Audio & Music: ElevenLabs, Suno AI, Mubert, Adobe Podcast, Descript
- VFX & Motion: Adobe After Effects, Topaz Video AI, Nuke, Unreal Engine
- Collaboration: Frame.io, Notion, Celtx, Arc Studio

Match tool suggestions to the genre, mood, and visual demands of this specific script. Be specific in descriptions.

Script:
${script.slice(0, 2000)}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API error:", errData);
      return res.status(500).json({ error: "Failed to get response from Gemini API." });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean and parse JSON
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🎬 Film Tool Suggester running at http://localhost:${PORT}\n`);
});

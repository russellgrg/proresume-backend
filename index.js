const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/generate", async (req, res) => {
  console.log("🔥 /generate endpoint hit");

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    console.log("📥 Prompt received:", messages);

    const completion = await openai.chat.completions.create({
  model: "mistralai/mistral-7b-instruct", // ✅ Free model that works
  messages,
  temperature: 0.7,
  max_tokens: 1500,
});

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });

  } catch (error) {
    console.error("💥 Error:", error);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error?.message || "OpenRouter API error",
      });
    }

    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
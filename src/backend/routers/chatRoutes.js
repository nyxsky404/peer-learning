import express from "express";
import OpenAI from "openai";

const router = express.Router();

// OpenRouter is OpenAI-compatible, so the OpenAI SDK works by pointing at the
// OpenRouter base URL. The API key is read from the server environment and is
// never sent to the client.
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:8080",
    "X-Title": "Peer Learning AI",
  },
});

router.post("/chat", async (req, res) => {
  try {
    const {
      messages,
      systemPrompt,
      model = "openai/gpt-3.5-turbo",
      max_tokens = 512,
      temperature = 0.7,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "A non-empty messages array is required." });
    }

    // Validate each message has the expected shape to avoid sending malformed
    // requests upstream.
    const isValid = messages.every(
      (m) =>
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant" || m.role === "system") &&
        typeof m.content === "string"
    );

    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Each message must have a role (user|assistant|system) and a string content field." });
    }

    const chatMessages = systemPrompt
      ? [{ role: "system", content: String(systemPrompt) }, ...messages]
      : messages;

    const response = await openrouter.chat.completions.create({
      model,
      messages: chatMessages,
      max_tokens,
      temperature,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to get a response from the AI service." });
  }
});

export default router;

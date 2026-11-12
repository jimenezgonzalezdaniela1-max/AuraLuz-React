import { env } from "../config/env.js";

export const geminiEnabled = Boolean(env.geminiApiKey && env.geminiModel);

// Llama a la API REST de Gemini. La clave viaja en un encabezado y NUNCA llega al navegador.
export async function askGemini({ system, messages }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.geminiModel)}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.geminiApiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) throw new Error(`Gemini respondió con estado ${res.status}`); // 429 = se acabó la cuota gratuita

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("Gemini devolvió una respuesta vacía");
  return text;
}

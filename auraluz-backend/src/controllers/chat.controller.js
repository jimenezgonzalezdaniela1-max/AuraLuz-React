import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { chat } from "../services/chat.service.js";

const MAX_MESSAGES = 30; // lo que se acepta
const KEEP_LAST = 10; // lo que se envía a la IA
const MAX_LENGTH = 500; // caracteres por mensaje

export const sendMessage = asyncHandler(async (req, res) => {
  const raw = req.body?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    throw new HttpError(400, "Conversación inválida.");
  }

  const messages = raw
    .map((m) => {
      if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        throw new HttpError(400, "Conversación inválida.");
      }
      return { role: m.role, content: m.content.trim().slice(0, MAX_LENGTH) };
    })
    .filter((m) => m.content)
    .slice(-KEEP_LAST);

  while (messages.length && messages[0].role !== "user") messages.shift(); // debe empezar con el cliente
  if (messages.length === 0 || messages.at(-1).role !== "user") {
    throw new HttpError(400, "El último mensaje debe ser del cliente.");
  }

  res.json(await chat(req.auth.id, messages));
});

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { UPLOADS_DIR } from "../config/paths.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// La imagen llega a memoria (máx. 2 MB) y solo se guarda si realmente es JPG, PNG o WebP
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1 } });

// Se identifica el formato por los primeros bytes del archivo, no por lo que diga el nombre o el navegador
function detectType(b) {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length > 12 && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return "png";
  if (b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, "Selecciona una imagen.");
  const ext = detectType(req.file.buffer);
  if (!ext) throw new HttpError(400, "Formato no permitido. Usa JPG, PNG o WebP.");

  const name = `${crypto.randomUUID()}.${ext}`; // nombre aleatorio: nunca el que manda el usuario
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), req.file.buffer);

  res.status(201).json({ url: `/uploads/${name}` });
});

import Product from "../models/Product.js";
import { slugify } from "../utils/slug.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// El frontend identifica cada vela por su "slug" (rosa, girasol...), así que sale como "id"
const toPublic = (p) => ({
  id: p.slug,
  name: p.name,
  title: p.title,
  description: p.description,
  price: p.price,
  image: p.image,
  alt: p.alt,
});

const bySeedOrder = { createdAt: 1, _id: 1 };

// Catálogo para la tienda: solo productos activos
export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort(bySeedOrder);
  res.json({ products: products.map(toPublic) });
});

// Catálogo para el administrador: incluye los desactivados
export const adminListProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort(bySeedOrder);
  res.json({ products: products.map((p) => ({ ...toPublic(p), active: p.active })) });
});

// Solo estos campos se pueden modificar (evita que se cambie cualquier otra cosa)
const TEXT_FIELDS = { name: 80, title: 60, description: 300, image: 200, alt: 200 };

export const updateProduct = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  const update = {};

  for (const [field, max] of Object.entries(TEXT_FIELDS)) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== "string" || body[field].trim().length > max) {
      throw new HttpError(400, `El campo "${field}" es inválido (máximo ${max} caracteres).`);
    }
    if ((field === "name" || field === "title") && body[field].trim() === "") {
      throw new HttpError(400, `El campo "${field}" no puede estar vacío.`);
    }
    update[field] = body[field].trim();
    if (field === "image" && update.image && !IMAGE_RE.test(update.image)) {
      throw new HttpError(400, "Imagen inválida: usa una imagen subida desde el panel o una URL https.");
    }
  }

  if (body.price !== undefined) {
    if (!Number.isInteger(body.price) || body.price < 0 || body.price > 10_000_000) {
      throw new HttpError(400, "El precio debe ser un número entero entre 0 y 10.000.000.");
    }
    update.price = body.price;
  }
  if (body.active !== undefined) {
    if (typeof body.active !== "boolean") throw new HttpError(400, 'El campo "active" debe ser true o false.');
    update.active = body.active;
  }
  if (Object.keys(update).length === 0) throw new HttpError(400, "No enviaste ningún campo para modificar.");

  const product = await Product.findOneAndUpdate(
    { slug: String(req.params.slug) },
    { $set: update },
    { new: true, runValidators: true }
  );
  if (!product) throw new HttpError(404, "Producto no encontrado.");

  res.json({ product: { ...toPublic(product), active: product.active } });
});

// Imágenes permitidas: subidas desde el panel, archivos del frontend (/img) o una URL https
const IMAGE_RE = /^(\/uploads\/[a-f0-9-]+\.(jpg|png|webp)|\/img\/[\w.-]+|https:\/\/\S+)$/i;

const cleanText = (value, field, max, required = false) => {
  if (typeof value !== "string" || value.trim().length > max || (required && value.trim() === "")) {
    throw new HttpError(400, `El campo "${field}" es inválido${required ? " o está vacío" : ""} (máximo ${max} caracteres).`);
  }
  return value.trim();
};

export const createProduct = asyncHandler(async (req, res) => {
  const b = req.body ?? {};

  const title = cleanText(b.title, "title", 60, true);
  const name = b.name === undefined || b.name === "" ? `Vela ${title}` : cleanText(b.name, "name", 80, true);
  const description = cleanText(b.description ?? "", "description", 300);
  const alt = b.alt === undefined || b.alt === "" ? `Vela aromática ${title}` : cleanText(b.alt, "alt", 200);
  const image = cleanText(b.image ?? "", "image", 200);
  if (image && !IMAGE_RE.test(image)) {
    throw new HttpError(400, "Imagen inválida: usa una imagen subida desde el panel o una URL https.");
  }

  if (!Number.isInteger(b.price) || b.price < 0 || b.price > 10_000_000) {
    throw new HttpError(400, "El precio debe ser un número entero entre 0 y 10.000.000.");
  }
  if (b.active !== undefined && typeof b.active !== "boolean") {
    throw new HttpError(400, 'El campo "active" debe ser true o false.');
  }

  // El identificador sale del título y nunca se repite: lavanda, lavanda-2...
  const base = slugify(title) || "producto";
  let slug = base;
  for (let n = 2; await Product.exists({ slug }); n++) slug = `${base}-${n}`;

  let product;
  try {
    product = await Product.create({ slug, name, title, description, price: b.price, image, alt, active: b.active ?? true });
  } catch (err) {
    if (err.code === 11000) throw new HttpError(409, "Ya existe un producto con ese nombre. Intenta de nuevo.");
    throw err;
  }
  res.status(201).json({ product: { ...toPublic(product), active: product.active } });
});

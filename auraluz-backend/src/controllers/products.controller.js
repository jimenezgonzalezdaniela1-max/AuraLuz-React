import Product from "../models/Product.js";
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

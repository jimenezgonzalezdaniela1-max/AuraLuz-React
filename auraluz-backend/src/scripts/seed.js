/*
 * Crea los productos y el administrador. Se puede ejecutar varias veces sin duplicar nada:
 * no pisa productos ni precios que ya existan.
 *   npm run seed
 */
import "../config/env.js"; // carga el .env
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const products = [
  { slug: "rosa", name: "Vela Rosa", title: "Rosa", description: "Aroma floral suave y romántico.", price: 25000, image: "/img/rosa.jpg", alt: "Vela aromática con forma de rosa" },
  { slug: "girasol", name: "Vela Girasol", title: "Girasol", description: "Aroma cálido con notas de vainilla.", price: 28000, image: "/img/girasol.jpg", alt: "Vela aromática con forma de girasol" },
  { slug: "campana", name: "Vela Campana amarilla", title: "Campana amarilla", description: "Aroma cítrico y fresco.", price: 22000, image: "/img/campana-amarilla.jpg", alt: "Vela aromática con forma de campana amarilla" },
  { slug: "margarita", name: "Vela Margarita", title: "Margarita", description: "Aroma limpio con toques de manzanilla.", price: 20000, image: "/img/margarita.jpg", alt: "Vela aromática con forma de margarita" },
];

async function main() {
  const { ADMIN_NAME = "Administrador", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env");
  }
  if (ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
  }

  await connectDB();

  for (const p of products) {
    const r = await Product.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
    console.log(r.upsertedCount ? `Producto creado: ${p.title}` : `Producto ya existía: ${p.title}`);
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  if (await User.exists({ email })) {
    console.log(`El administrador ${email} ya existe (no se modificó).`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email,
      passwordHash: await User.hashPassword(ADMIN_PASSWORD),
      role: "admin",
    });
    console.log(`Administrador creado: ${email}`);
  }

  await disconnectDB();
}

main().catch(async (err) => {
  console.error("Error en el seed:", err.message);
  await disconnectDB();
  process.exit(1);
});

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Hash falso: se compara cuando el correo no existe, para que la respuesta tarde igual
const DUMMY_HASH = bcrypt.hashSync("contrasena-falsa", 12);

const toPublic = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const isText = (v) => typeof v === "string";

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone = "", password } = req.body ?? {};

  if (!isText(name) || name.trim().length < 2 || name.trim().length > 80) {
    throw new HttpError(400, "Escribe tu nombre (entre 2 y 80 caracteres).");
  }
  if (!isText(email) || !EMAIL_RE.test(email.trim())) {
    throw new HttpError(400, "Correo electrónico inválido.");
  }
  if (!isText(phone) || phone.trim().length > 30) {
    throw new HttpError(400, "Teléfono inválido.");
  }
  if (!isText(password) || password.length < 8 || password.length > 72) {
    throw new HttpError(400, "La contraseña debe tener entre 8 y 72 caracteres.");
  }

  let user;
  try {
    user = await User.create({
      name,
      email,
      phone,
      passwordHash: await User.hashPassword(password),
      role: "cliente", // el rol NUNCA viene del cliente
    });
  } catch (err) {
    if (err.code === 11000) throw new HttpError(409, "Ya existe una cuenta con ese correo.");
    throw err;
  }

  res.status(201).json({ token: signToken(user), user: toPublic(user) });
});

// Cada rol entra por su propia ruta: una cuenta de cliente no sirve en el login de administrador y viceversa
const makeLogin = (role) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!isText(email) || !isText(password)) {
      throw new HttpError(400, "Escribe tu correo y contraseña.");
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), role }).select("+passwordHash");
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) throw new HttpError(401, "Correo o contraseña incorrectos.");

    res.json({ token: signToken(user), user: toPublic(user) });
  });

export const login = makeLogin("cliente");
export const adminLogin = makeLogin("admin");

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.id);
  if (!user) throw new HttpError(401, "Sesión inválida.");
  res.json({ user: toPublic(user) });
});

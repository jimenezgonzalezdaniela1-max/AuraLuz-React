import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo inválido"],
    },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    // select:false -> nunca se devuelve en consultas salvo que se pida con .select("+passwordHash")
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["cliente", "admin"], default: "cliente", index: true },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12);

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Al convertir a JSON jamás sale el hash
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // "rosa", "girasol"...
    name: { type: String, required: true, trim: true },        // "Vela Rosa"
    title: { type: String, required: true, trim: true },       // "Rosa"
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },           // pesos colombianos
    image: { type: String, default: "" },
    alt: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Product", productSchema);

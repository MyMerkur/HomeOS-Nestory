import { Schema, model, type InferSchemaType } from 'mongoose';
import { CATEGORIES, UNITS } from '../constants/inventory';

// Cross-home barcode -> product catalog. Populated both from Open Food Facts
// lookups (cached so we don't re-hit the external API) and from users' own
// manual entries (crowdsourced) — once any home types in a name/category for
// a barcode Open Food Facts doesn't know, every other home benefits from it.
const productCatalogSchema = new Schema(
  {
    barcode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: CATEGORIES },
    unit: { type: String, enum: UNITS },
    brand: { type: String },
    imageUrl: { type: String },
    source: { type: String, enum: ['openfoodfacts', 'user'], required: true },
  },
  { timestamps: true },
);

export type ProductCatalogDocument = InferSchemaType<typeof productCatalogSchema>;
export const ProductCatalog = model('ProductCatalog', productCatalogSchema);

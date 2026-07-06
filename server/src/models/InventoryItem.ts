import { Schema, model, type InferSchemaType } from 'mongoose';
import { CATEGORIES, INVENTORY_ITEM_STATUSES, UNITS } from '../constants/inventory';

const inventoryItemSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    locationId: { type: Schema.Types.ObjectId, ref: 'PantryLocation', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    normalizedName: { type: String, required: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: UNITS, required: true },
    expiryDate: { type: Date },
    purchaseDate: { type: Date },
    barcode: { type: String },
    brand: { type: String },
    status: { type: String, enum: INVENTORY_ITEM_STATUSES, default: 'active', index: true },
    notes: { type: String, maxlength: 500 },
    imageUrl: { type: String },
    reminderDaysBefore: { type: [Number], default: [7, 3, 1, 0] },
  },
  { timestamps: true },
);

inventoryItemSchema.index({ homeId: 1, status: 1 });
inventoryItemSchema.index({ homeId: 1, expiryDate: 1 });
inventoryItemSchema.index({ homeId: 1, locationId: 1 });
inventoryItemSchema.index({ homeId: 1, normalizedName: 1 });

export type InventoryItemDocument = InferSchemaType<typeof inventoryItemSchema>;
export const InventoryItem = model('InventoryItem', inventoryItemSchema);

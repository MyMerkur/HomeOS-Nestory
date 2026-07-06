import { Schema, model, type InferSchemaType } from 'mongoose';
import { CATEGORIES, UNITS } from '../constants/inventory';

export const SHOPPING_ITEM_STATUSES = ['pending', 'checked'] as const;

const shoppingItemSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    listId: { type: Schema.Types.ObjectId, ref: 'ShoppingList', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    normalizedName: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    unit: { type: String, enum: UNITS },
    category: { type: String, enum: CATEGORIES },
    status: { type: String, enum: SHOPPING_ITEM_STATUSES, default: 'pending', index: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sourceItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },
    checkedAt: { type: Date },
  },
  { timestamps: true },
);

shoppingItemSchema.index({ homeId: 1, listId: 1, status: 1 });

export type ShoppingItemDocument = InferSchemaType<typeof shoppingItemSchema>;
export const ShoppingItem = model('ShoppingItem', shoppingItemSchema);

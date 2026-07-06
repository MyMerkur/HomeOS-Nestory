import { Schema, model, type InferSchemaType } from 'mongoose';

const shoppingListSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    name: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ShoppingListDocument = InferSchemaType<typeof shoppingListSchema>;
export const ShoppingList = model('ShoppingList', shoppingListSchema);

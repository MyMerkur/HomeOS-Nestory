import { Schema, model, type InferSchemaType } from 'mongoose';

const pantryLocationSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['fridge', 'freezer', 'pantry', 'cabinet', 'medicine', 'other'],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

pantryLocationSchema.index({ homeId: 1, type: 1 });

export type PantryLocationDocument = InferSchemaType<typeof pantryLocationSchema>;
export const PantryLocation = model('PantryLocation', pantryLocationSchema);

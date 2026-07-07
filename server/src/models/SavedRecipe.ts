import { Schema, model, type InferSchemaType } from 'mongoose';

const savedRecipeSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

savedRecipeSchema.index({ homeId: 1, recipeId: 1 }, { unique: true });

export type SavedRecipeDocument = InferSchemaType<typeof savedRecipeSchema>;
export const SavedRecipe = model('SavedRecipe', savedRecipeSchema);

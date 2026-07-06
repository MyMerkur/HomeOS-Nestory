import { Schema, model, type InferSchemaType } from 'mongoose';

const recipeIngredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, index: true },
    optional: { type: Boolean, default: false },
  },
  { _id: false },
);

const recipeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, trim: true },
    ingredients: { type: [recipeIngredientSchema], required: true },
    instructions: { type: [String], required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export type RecipeDocument = InferSchemaType<typeof recipeSchema>;
export const Recipe = model('Recipe', recipeSchema);

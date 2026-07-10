import { Schema, model, type InferSchemaType } from 'mongoose';
import { RECIPE_CATEGORIES } from '../constants/recipe';

const recipeIngredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true },
    normalizedName: { type: String, required: true, index: true },
    optional: { type: Boolean, default: false },
  },
  { _id: false },
);

const recipeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    nameEn: { type: String, trim: true },
    category: { type: String, trim: true, enum: RECIPE_CATEGORIES },
    ingredients: { type: [recipeIngredientSchema], required: true },
    instructions: { type: [String], required: true },
    instructionsEn: { type: [String] },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export type RecipeDocument = InferSchemaType<typeof recipeSchema>;
export const Recipe = model('Recipe', recipeSchema);

import type { Request, Response } from 'express';
import * as recipeService from '../services/recipeService';
import type { RecipeLang } from '../services/recipeService';
import { sendSuccess } from '../utils/apiResponse';

function resolveLang(value: unknown): RecipeLang {
  return value === 'en' ? 'en' : 'tr';
}

export async function getAllRecipesHandler(req: Request, res: Response) {
  const recipes = await recipeService.getAllRecipes(req.params.homeId, resolveLang(req.query.lang));
  sendSuccess(res, { recipes }, 'All recipes fetched successfully');
}

export async function getSavedRecipesHandler(req: Request, res: Response) {
  const recipes = await recipeService.getSavedRecipes(req.params.homeId, resolveLang(req.query.lang));
  sendSuccess(res, { recipes }, 'Saved recipes fetched successfully');
}

export async function saveRecipeHandler(req: Request, res: Response) {
  await recipeService.saveRecipe(req.params.homeId, req.params.recipeId, req.userId!);
  sendSuccess(res, {}, 'Recipe saved successfully');
}

export async function unsaveRecipeHandler(req: Request, res: Response) {
  await recipeService.unsaveRecipe(req.params.homeId, req.params.recipeId);
  sendSuccess(res, {}, 'Recipe unsaved successfully');
}

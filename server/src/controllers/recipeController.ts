import type { Request, Response } from 'express';
import * as recipeService from '../services/recipeService';
import { sendSuccess } from '../utils/apiResponse';

export async function getSuggestionsHandler(req: Request, res: Response) {
  const recipes = await recipeService.getSuggestions(req.params.homeId);
  sendSuccess(res, { recipes }, 'Recipe suggestions fetched successfully');
}

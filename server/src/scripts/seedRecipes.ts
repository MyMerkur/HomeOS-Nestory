import { connectDB, disconnectDB } from '../config/db';
import { logger } from '../config/logger';
import { Recipe } from '../models/Recipe';
import { normalizeName } from '../utils/normalize';
import { RECIPES_SEED_DATA } from './recipesSeedData';

async function seedRecipes() {
  await connectDB();

  for (const recipe of RECIPES_SEED_DATA) {
    // eslint-disable-next-line no-await-in-loop
    await Recipe.findOneAndUpdate(
      { name: recipe.name },
      {
        name: recipe.name,
        category: recipe.category,
        ingredients: recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          normalizedName: normalizeName(ingredient.name),
          optional: ingredient.optional ?? false,
        })),
        instructions: recipe.instructions,
      },
      { upsert: true, new: true },
    );
  }

  logger.info(`Seeded ${RECIPES_SEED_DATA.length} recipes`);
  await disconnectDB();
}

seedRecipes().catch((error) => {
  logger.error({ error }, 'Failed to seed recipes');
  process.exit(1);
});

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as inventoryActionService from './inventoryActionService';
import * as recipeService from './recipeService';
import { Recipe } from '../models/Recipe';
import { normalizeName } from '../utils/normalize';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

async function setupHome() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const locations = await locationService.listLocations(home.id);
  const fridge = locations.find((l) => l.type === 'fridge')!;
  return { userId: user.id, homeId: home.id, fridgeId: fridge.id };
}

function ingredient(name: string, optional = false) {
  return { name, normalizedName: normalizeName(name), optional };
}

describe('recipeService', () => {
  it('gives 100% coverage when all required ingredients are in stock', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await Recipe.create({
      name: 'Menemen',
      category: 'Kahvaltı',
      ingredients: [ingredient('Yumurta'), ingredient('Domates'), ingredient('Tuz', true)],
      instructions: ['Pişirin.'],
    });

    await inventoryService.createItem(homeId, userId, {
      name: 'Yumurta',
      locationId: fridgeId,
      category: 'Other',
      quantity: 6,
      unit: 'piece',
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Domates',
      locationId: fridgeId,
      category: 'Vegetable',
      quantity: 3,
      unit: 'piece',
    });

    const suggestions = await recipeService.getAllRecipes(homeId);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].name).toBe('Menemen');
    expect(suggestions[0].coveragePercent).toBe(100);
    expect(suggestions[0].missingIngredients).toEqual([]);
  });

  it('reports missing required ingredients and partial coverage', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await Recipe.create({
      name: 'Mercimek Çorbası',
      category: 'Çorba',
      ingredients: [ingredient('Kırmızı Mercimek'), ingredient('Soğan'), ingredient('Havuç')],
      instructions: ['Kaynatın.'],
    });

    await inventoryService.createItem(homeId, userId, {
      name: 'Kırmızı Mercimek',
      locationId: fridgeId,
      category: 'Other',
      quantity: 1,
      unit: 'kg',
    });

    const suggestions = await recipeService.getAllRecipes(homeId);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].coveragePercent).toBe(33);
    expect(suggestions[0].missingIngredients.sort()).toEqual(['Havuç', 'Soğan']);
  });

  it('ignores non-active inventory items when computing coverage', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await Recipe.create({
      name: 'Omlet',
      category: 'Kahvaltı',
      ingredients: [ingredient('Yumurta')],
      instructions: ['Pişirin.'],
    });

    const item = await inventoryService.createItem(homeId, userId, {
      name: 'Yumurta',
      locationId: fridgeId,
      category: 'Other',
      quantity: 6,
      unit: 'piece',
    });
    await inventoryActionService.consumeItem(homeId, userId, item.id);

    const recipes = await recipeService.getAllRecipes(homeId);

    expect(recipes).toHaveLength(1);
    expect(recipes[0].coveragePercent).toBe(0);
    expect(recipes[0].missingIngredients).toEqual(['Yumurta']);
  });

  it('marks a recipe as saved after saveRecipe and reflects it in getAllRecipes', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    const recipe = await Recipe.create({
      name: 'Menemen',
      category: 'Kahvaltı',
      ingredients: [ingredient('Yumurta')],
      instructions: ['Pişirin.'],
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Yumurta',
      locationId: fridgeId,
      category: 'Other',
      quantity: 6,
      unit: 'piece',
    });

    let suggestions = await recipeService.getAllRecipes(homeId);
    expect(suggestions[0].isSaved).toBe(false);

    await recipeService.saveRecipe(homeId, recipe.id, userId);

    suggestions = await recipeService.getAllRecipes(homeId);
    expect(suggestions[0].isSaved).toBe(true);
  });

  it('is idempotent when saving the same recipe twice', async () => {
    const { homeId, userId } = await setupHome();
    const recipe = await Recipe.create({
      name: 'Süt Muhallebisi',
      ingredients: [ingredient('Süt')],
      instructions: ['Pişirin.'],
    });

    await recipeService.saveRecipe(homeId, recipe.id, userId);
    await expect(recipeService.saveRecipe(homeId, recipe.id, userId)).resolves.not.toThrow();

    const saved = await recipeService.getSavedRecipes(homeId);
    expect(saved).toHaveLength(1);
  });

  it('throws when saving a recipe that does not exist', async () => {
    const { homeId, userId } = await setupHome();
    const missingId = new mongoose.Types.ObjectId().toString();

    await expect(recipeService.saveRecipe(homeId, missingId, userId)).rejects.toThrow(
      'Recipe not found',
    );
  });

  it('getSavedRecipes returns saved recipes even with zero coverage, and excludes unsaved ones', async () => {
    const { homeId, userId } = await setupHome();

    const saved = await Recipe.create({
      name: 'Süt Muhallebisi',
      ingredients: [ingredient('Süt'), ingredient('Nişasta')],
      instructions: ['Pişirin.'],
    });
    await Recipe.create({
      name: 'Menemen',
      ingredients: [ingredient('Yumurta')],
      instructions: ['Pişirin.'],
    });

    await recipeService.saveRecipe(homeId, saved.id, userId);

    const savedRecipes = await recipeService.getSavedRecipes(homeId);

    expect(savedRecipes).toHaveLength(1);
    expect(savedRecipes[0].name).toBe('Süt Muhallebisi');
    expect(savedRecipes[0].coveragePercent).toBe(0);
    expect(savedRecipes[0].isSaved).toBe(true);
  });

  it('getAllRecipes includes zero-coverage recipes and sorts by coverage desc', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await Recipe.create({
      name: 'Süt Muhallebisi',
      ingredients: [ingredient('Süt'), ingredient('Nişasta')],
      instructions: ['Pişirin.'],
    });
    await Recipe.create({
      name: 'Omlet',
      ingredients: [ingredient('Yumurta')],
      instructions: ['Pişirin.'],
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Yumurta',
      locationId: fridgeId,
      category: 'Other',
      quantity: 6,
      unit: 'piece',
    });

    const all = await recipeService.getAllRecipes(homeId);

    expect(all).toHaveLength(2);
    expect(all[0].name).toBe('Omlet');
    expect(all[0].coveragePercent).toBe(100);
    expect(all[1].name).toBe('Süt Muhallebisi');
    expect(all[1].coveragePercent).toBe(0);
  });

  it('unsaveRecipe removes a recipe from the saved list and is idempotent', async () => {
    const { homeId, userId } = await setupHome();
    const recipe = await Recipe.create({
      name: 'Menemen',
      ingredients: [ingredient('Yumurta')],
      instructions: ['Pişirin.'],
    });

    await recipeService.saveRecipe(homeId, recipe.id, userId);
    expect(await recipeService.getSavedRecipes(homeId)).toHaveLength(1);

    await recipeService.unsaveRecipe(homeId, recipe.id);
    expect(await recipeService.getSavedRecipes(homeId)).toHaveLength(0);

    await expect(recipeService.unsaveRecipe(homeId, recipe.id)).resolves.not.toThrow();
  });
});

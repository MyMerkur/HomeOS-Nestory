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

    const suggestions = await recipeService.getSuggestions(homeId);

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

    const suggestions = await recipeService.getSuggestions(homeId);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].coveragePercent).toBe(33);
    expect(suggestions[0].missingIngredients.sort()).toEqual(['Havuç', 'Soğan']);
  });

  it('excludes recipes with zero matching ingredients', async () => {
    const { homeId } = await setupHome();

    await Recipe.create({
      name: 'Süt Muhallebisi',
      category: 'Tatlı',
      ingredients: [ingredient('Süt'), ingredient('Nişasta')],
      instructions: ['Pişirin.'],
    });

    const suggestions = await recipeService.getSuggestions(homeId);

    expect(suggestions).toHaveLength(0);
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

    const suggestions = await recipeService.getSuggestions(homeId);

    expect(suggestions).toHaveLength(0);
  });
});

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProductCatalog } from '../models/ProductCatalog';
import { lookupProductByBarcode, recordUserProvidedProduct } from './productLookupService';

let mongo: MongoMemoryServer;
let fetchSpy: jest.SpiedFunction<typeof fetch>;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await ProductCatalog.deleteMany({});
});

beforeEach(() => {
  fetchSpy = jest.spyOn(global, 'fetch');
});

afterEach(() => {
  fetchSpy.mockRestore();
});

function mockOpenFoodFactsResponse(body: unknown) {
  fetchSpy.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
}

describe('lookupProductByBarcode', () => {
  it('returns a mapped product and caches it when Open Food Facts finds a match', async () => {
    mockOpenFoodFactsResponse({
      status: 1,
      product: {
        product_name: 'Nutella',
        brands: 'Nutella',
        categories_tags: ['en:breakfasts', 'en:spreads'],
        image_front_url: 'https://example.com/nutella.jpg',
      },
    });

    const result = await lookupProductByBarcode('3017620425035');

    expect(result).toEqual({
      barcode: '3017620425035',
      name: 'Nutella',
      brand: 'Nutella',
      category: null,
      unit: null,
      imageUrl: 'https://example.com/nutella.jpg',
    });

    const cached = await ProductCatalog.findOne({ barcode: '3017620425035' });
    expect(cached?.source).toBe('openfoodfacts');
  });

  it('prefers the Turkish product name when available', async () => {
    mockOpenFoodFactsResponse({ status: 1, product: { product_name: 'Milk', product_name_tr: 'Süt' } });

    const result = await lookupProductByBarcode('123');

    expect(result?.name).toBe('Süt');
  });

  it('maps known category tags to internal categories', async () => {
    mockOpenFoodFactsResponse({
      status: 1,
      product: { product_name: 'Whole Milk', categories_tags: ['en:dairies', 'en:milk'] },
    });

    const result = await lookupProductByBarcode('456');

    expect(result?.category).toBe('Dairy');
  });

  it('returns null and caches nothing when the product is not found anywhere', async () => {
    mockOpenFoodFactsResponse({ status: 0 });

    const result = await lookupProductByBarcode('000000');

    expect(result).toBeNull();
    expect(await ProductCatalog.countDocuments()).toBe(0);
  });

  it('returns null when the upstream request fails', async () => {
    fetchSpy.mockRejectedValue(new Error('network error'));

    const result = await lookupProductByBarcode('000000');

    expect(result).toBeNull();
  });

  it('serves a cached catalog hit without calling Open Food Facts again', async () => {
    await ProductCatalog.create({
      barcode: '999',
      name: 'Bingo Çamaşır Suyu',
      category: 'Cleaning',
      unit: 'bottle',
      source: 'user',
    });

    const result = await lookupProductByBarcode('999');

    expect(result).toEqual({
      barcode: '999',
      name: 'Bingo Çamaşır Suyu',
      brand: null,
      category: 'Cleaning',
      unit: 'bottle',
      imageUrl: null,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('recordUserProvidedProduct', () => {
  it('stores a barcode a user typed in manually', async () => {
    await recordUserProvidedProduct('777', 'Bingo Çamaşır Suyu', 'Cleaning', 'bottle');

    const stored = await ProductCatalog.findOne({ barcode: '777' });
    expect(stored?.name).toBe('Bingo Çamaşır Suyu');
    expect(stored?.source).toBe('user');
  });

  it('does not overwrite an existing catalog entry', async () => {
    await ProductCatalog.create({
      barcode: '888',
      name: 'Original Name',
      category: 'Other',
      unit: 'piece',
      source: 'openfoodfacts',
    });

    await recordUserProvidedProduct('888', 'Different Name', 'Cleaning', 'bottle');

    const stored = await ProductCatalog.findOne({ barcode: '888' });
    expect(stored?.name).toBe('Original Name');
    expect(stored?.source).toBe('openfoodfacts');
  });
});

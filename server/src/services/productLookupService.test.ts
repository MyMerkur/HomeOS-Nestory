import { lookupProductByBarcode } from './productLookupService';

describe('productLookupService', () => {
  let fetchSpy: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('returns a mapped product when Open Food Facts finds a match', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 1,
          product: {
            product_name: 'Nutella',
            brands: 'Nutella',
            categories_tags: ['en:breakfasts', 'en:spreads'],
            image_front_url: 'https://example.com/nutella.jpg',
          },
        }),
        { status: 200 },
      ),
    );

    const result = await lookupProductByBarcode('3017620425035');

    expect(result).toEqual({
      barcode: '3017620425035',
      name: 'Nutella',
      brand: 'Nutella',
      category: null,
      imageUrl: 'https://example.com/nutella.jpg',
    });
  });

  it('prefers the Turkish product name when available', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 1,
          product: { product_name: 'Milk', product_name_tr: 'Süt' },
        }),
        { status: 200 },
      ),
    );

    const result = await lookupProductByBarcode('123');

    expect(result?.name).toBe('Süt');
  });

  it('maps known category tags to internal categories', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 1,
          product: { product_name: 'Whole Milk', categories_tags: ['en:dairies', 'en:milk'] },
        }),
        { status: 200 },
      ),
    );

    const result = await lookupProductByBarcode('456');

    expect(result?.category).toBe('Dairy');
  });

  it('returns null when the product is not found', async () => {
    fetchSpy.mockResolvedValue(new Response(JSON.stringify({ status: 0 }), { status: 200 }));

    const result = await lookupProductByBarcode('000000');

    expect(result).toBeNull();
  });

  it('returns null when the upstream request fails', async () => {
    fetchSpy.mockRejectedValue(new Error('network error'));

    const result = await lookupProductByBarcode('000000');

    expect(result).toBeNull();
  });

  it('returns null when the upstream response is not ok', async () => {
    fetchSpy.mockResolvedValue(new Response(null, { status: 500 }));

    const result = await lookupProductByBarcode('000000');

    expect(result).toBeNull();
  });
});

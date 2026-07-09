import { logger } from '../config/logger';
import type { Category } from '../constants/inventory';

export type ProductLookupResult = {
  barcode: string;
  name: string;
  brand: string | null;
  category: Category | null;
  imageUrl: string | null;
};

const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/api/v2/product';
const REQUEST_TIMEOUT_MS = 5000;
const FIELDS = 'product_name,product_name_tr,brands,categories_tags,image_front_url';

const CATEGORY_TAG_MAP: Array<{ category: Category; keywords: string[] }> = [
  { category: 'Dairy', keywords: ['dairies', 'dairy', 'milk', 'cheese', 'yogurt', 'yoghurt'] },
  { category: 'Meat', keywords: ['meat', 'poultry', 'fish', 'seafood', 'sausage'] },
  { category: 'Vegetable', keywords: ['vegetable', 'vegetables'] },
  { category: 'Fruit', keywords: ['fruit', 'fruits'] },
  { category: 'Bakery', keywords: ['bread', 'bakery', 'pastries', 'viennoiseries'] },
  { category: 'Drink', keywords: ['beverage', 'beverages', 'drink', 'drinks', 'water', 'juice', 'soda'] },
  { category: 'Frozen', keywords: ['frozen'] },
];

function mapCategory(categoriesTags: string[] | undefined): Category | null {
  if (!categoriesTags?.length) return null;
  const normalized = categoriesTags.map((tag) => tag.toLowerCase());

  for (const { category, keywords } of CATEGORY_TAG_MAP) {
    if (normalized.some((tag) => keywords.some((keyword) => tag.includes(keyword)))) {
      return category;
    }
  }
  return null;
}

type OpenFoodFactsProduct = {
  product_name?: string;
  product_name_tr?: string;
  brands?: string;
  categories_tags?: string[];
  image_front_url?: string;
};

type OpenFoodFactsResponse = {
  status: number;
  product?: OpenFoodFactsProduct;
};

export async function lookupProductByBarcode(barcode: string): Promise<ProductLookupResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_URL}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`,
      { signal: controller.signal },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as OpenFoodFactsResponse;
    if (payload.status !== 1 || !payload.product) return null;

    const product = payload.product;
    const name = product.product_name_tr || product.product_name;
    if (!name) return null;

    return {
      barcode,
      name,
      brand: product.brands ?? null,
      category: mapCategory(product.categories_tags),
      imageUrl: product.image_front_url ?? null,
    };
  } catch (err) {
    logger.warn({ err, barcode }, 'Product lookup failed');
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

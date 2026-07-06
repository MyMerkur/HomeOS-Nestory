import { apiClient } from '../../../services/apiClient';
import type { Category, Unit } from '../constants';

export type PantryLocation = {
  id: string;
  name: string;
  type: string;
  order: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  locationId: string;
  expiryDate: string | null;
  purchaseDate: string | null;
  brand: string | null;
  barcode: string | null;
  status: string;
  notes: string | null;
  imageUrl: string | null;
  reminderDaysBefore: number[];
  createdAt: string;
  updatedAt: string;
};

export type ListItemsParams = {
  locationId?: string;
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type ListItemsResult = {
  items: InventoryItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function listLocations(homeId: string): Promise<PantryLocation[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ locations: PantryLocation[] }>>(
    `/homes/${homeId}/locations`,
  );
  return data.data.locations;
}

export async function listItems(
  homeId: string,
  params: ListItemsParams,
): Promise<ListItemsResult> {
  const { data } = await apiClient.get<ApiEnvelope<ListItemsResult>>(`/homes/${homeId}/items`, {
    params,
  });
  return data.data;
}

export async function getItem(homeId: string, itemId: string): Promise<InventoryItem> {
  const { data } = await apiClient.get<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}`,
  );
  return data.data.item;
}

export type ItemInput = {
  name: string;
  locationId: string;
  category: Category;
  quantity: number;
  unit: Unit;
  expiryDate?: string;
};

export async function createItem(homeId: string, input: ItemInput): Promise<InventoryItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items`,
    input,
  );
  return data.data.item;
}

export async function updateItem(
  homeId: string,
  itemId: string,
  input: Partial<ItemInput>,
): Promise<InventoryItem> {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}`,
    input,
  );
  return data.data.item;
}

export async function consumeItem(homeId: string, itemId: string): Promise<InventoryItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}/consume`,
  );
  return data.data.item;
}

export async function discardItem(homeId: string, itemId: string): Promise<InventoryItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}/discard`,
  );
  return data.data.item;
}

export async function freezeItem(homeId: string, itemId: string): Promise<InventoryItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}/freeze`,
  );
  return data.data.item;
}

export async function addToShopping(homeId: string, itemId: string): Promise<InventoryItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: InventoryItem }>>(
    `/homes/${homeId}/items/${itemId}/add-to-shopping`,
  );
  return data.data.item;
}

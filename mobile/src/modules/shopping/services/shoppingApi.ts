import { apiClient } from '../../../services/apiClient';
import type { Category, Unit } from '../../pantry/constants';

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit | null;
  category: Category | null;
  status: 'pending' | 'checked';
  checkedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShoppingItemInput = {
  name: string;
  quantity?: number;
  unit?: Unit;
  category?: Category;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function listShoppingItems(
  homeId: string,
  status?: 'pending' | 'checked',
): Promise<ShoppingItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ items: ShoppingItem[] }>>(
    `/homes/${homeId}/shopping/items`,
    { params: status ? { status } : undefined },
  );
  return data.data.items;
}

export async function addShoppingItem(
  homeId: string,
  input: ShoppingItemInput,
): Promise<ShoppingItem> {
  const { data } = await apiClient.post<ApiEnvelope<{ item: ShoppingItem }>>(
    `/homes/${homeId}/shopping/items`,
    input,
  );
  return data.data.item;
}

export async function updateShoppingItem(
  homeId: string,
  itemId: string,
  input: Partial<ShoppingItemInput>,
): Promise<ShoppingItem> {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ShoppingItem }>>(
    `/homes/${homeId}/shopping/items/${itemId}`,
    input,
  );
  return data.data.item;
}

export async function toggleShoppingItemCheck(homeId: string, itemId: string): Promise<ShoppingItem> {
  const { data } = await apiClient.patch<ApiEnvelope<{ item: ShoppingItem }>>(
    `/homes/${homeId}/shopping/items/${itemId}/check`,
  );
  return data.data.item;
}

export async function deleteShoppingItem(homeId: string, itemId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/shopping/items/${itemId}`);
}

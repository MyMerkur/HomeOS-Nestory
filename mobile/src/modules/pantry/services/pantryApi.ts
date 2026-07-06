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

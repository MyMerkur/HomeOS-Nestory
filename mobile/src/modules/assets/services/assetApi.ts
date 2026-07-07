import { apiClient } from '../../../services/apiClient';
import type { AssetCategory } from '../constants';

export type Asset = {
  id: string;
  name: string;
  category: AssetCategory;
  room: string | null;
  brand: string | null;
  serialNumber: string | null;
  purchaseDate: string | null;
  price: number | null;
  warrantyEndDate: string | null;
  receiptImageUrl: string | null;
  warrantyDocumentUrl: string | null;
  notes: string | null;
  reminderDaysBefore: number[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ListAssetsParams = {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type ListAssetsResult = {
  assets: Asset[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function listAssets(homeId: string, params: ListAssetsParams): Promise<ListAssetsResult> {
  const { data } = await apiClient.get<ApiEnvelope<ListAssetsResult>>(`/homes/${homeId}/assets`, {
    params,
  });
  return data.data;
}

export async function getAsset(homeId: string, assetId: string): Promise<Asset> {
  const { data } = await apiClient.get<ApiEnvelope<{ asset: Asset }>>(
    `/homes/${homeId}/assets/${assetId}`,
  );
  return data.data.asset;
}

export type AssetInput = {
  name: string;
  category: AssetCategory;
  room?: string;
  brand?: string;
  serialNumber?: string;
  purchaseDate?: string;
  price?: number;
  warrantyEndDate?: string;
  notes?: string;
};

export async function createAsset(homeId: string, input: AssetInput): Promise<Asset> {
  const { data } = await apiClient.post<ApiEnvelope<{ asset: Asset }>>(
    `/homes/${homeId}/assets`,
    input,
  );
  return data.data.asset;
}

export async function updateAsset(
  homeId: string,
  assetId: string,
  input: Partial<AssetInput> & { status?: 'active' | 'archived' },
): Promise<Asset> {
  const { data } = await apiClient.patch<ApiEnvelope<{ asset: Asset }>>(
    `/homes/${homeId}/assets/${assetId}`,
    input,
  );
  return data.data.asset;
}

export async function deleteAsset(homeId: string, assetId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/assets/${assetId}`);
}

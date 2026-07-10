import { apiClient } from '../../../services/apiClient';
import type { InventoryItem } from '../../pantry/services/pantryApi';

export type DashboardSummary = {
  expiringToday: number;
  expiringIn3Days: number;
  expiringInWeek: number;
  totalActive: number;
  pantryItemCount: number;
  medicineCount: number;
  assetCount: number;
  upcomingItems: InventoryItem[];
  spending: { paidThisMonth: number; unpaidTotal: number };
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function getDashboard(homeId: string): Promise<DashboardSummary> {
  const { data } = await apiClient.get<ApiEnvelope<{ dashboard: DashboardSummary }>>(
    `/homes/${homeId}/dashboard`,
  );
  return data.data.dashboard;
}

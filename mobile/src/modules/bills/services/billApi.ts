import { apiClient } from '../../../services/apiClient';
import type { BillCategory, BillStatus } from '../constants';

export type Bill = {
  id: string;
  name: string;
  category: BillCategory;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  status: BillStatus;
  paidAt: string | null;
  reminderDaysBefore: number[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListBillsParams = {
  status?: BillStatus;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type ListBillsResult = {
  bills: Bill[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function listBills(homeId: string, params: ListBillsParams): Promise<ListBillsResult> {
  const { data } = await apiClient.get<ApiEnvelope<ListBillsResult>>(`/homes/${homeId}/bills`, {
    params,
  });
  return data.data;
}

export async function getBill(homeId: string, billId: string): Promise<Bill> {
  const { data } = await apiClient.get<ApiEnvelope<{ bill: Bill }>>(
    `/homes/${homeId}/bills/${billId}`,
  );
  return data.data.bill;
}

export type BillInput = {
  name: string;
  category: BillCategory;
  amount: number;
  dueDate: string;
  isRecurring?: boolean;
  notes?: string;
};

export async function createBill(homeId: string, input: BillInput): Promise<Bill> {
  const { data } = await apiClient.post<ApiEnvelope<{ bill: Bill }>>(`/homes/${homeId}/bills`, input);
  return data.data.bill;
}

export async function updateBill(
  homeId: string,
  billId: string,
  input: Partial<BillInput>,
): Promise<Bill> {
  const { data } = await apiClient.patch<ApiEnvelope<{ bill: Bill }>>(
    `/homes/${homeId}/bills/${billId}`,
    input,
  );
  return data.data.bill;
}

export async function deleteBill(homeId: string, billId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/bills/${billId}`);
}

export async function markBillPaid(homeId: string, billId: string): Promise<Bill> {
  const { data } = await apiClient.post<ApiEnvelope<{ bill: Bill }>>(
    `/homes/${homeId}/bills/${billId}/mark-paid`,
  );
  return data.data.bill;
}

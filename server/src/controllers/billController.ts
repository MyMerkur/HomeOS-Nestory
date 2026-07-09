import type { Request, Response } from 'express';
import * as billService from '../services/billService';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateBillInput, ListBillsQuery, UpdateBillInput } from '../validations/billValidation';

export async function listBillsHandler(req: Request, res: Response) {
  const result = await billService.listBills(req.params.homeId, req.query as unknown as ListBillsQuery);
  sendSuccess(res, result, 'Bills fetched successfully');
}

export async function createBillHandler(req: Request, res: Response) {
  const bill = await billService.createBill(req.params.homeId, req.userId!, req.body as CreateBillInput);
  sendSuccess(res, { bill }, 'Bill created successfully', 201);
}

export async function getBillHandler(req: Request, res: Response) {
  const bill = await billService.getBill(req.params.homeId, req.params.billId);
  sendSuccess(res, { bill }, 'Bill fetched successfully');
}

export async function updateBillHandler(req: Request, res: Response) {
  const bill = await billService.updateBill(
    req.params.homeId,
    req.params.billId,
    req.body as UpdateBillInput,
  );
  sendSuccess(res, { bill }, 'Bill updated successfully');
}

export async function deleteBillHandler(req: Request, res: Response) {
  await billService.deleteBill(req.params.homeId, req.params.billId);
  sendSuccess(res, null, 'Bill deleted successfully');
}

export async function markBillPaidHandler(req: Request, res: Response) {
  const bill = await billService.markBillPaid(req.params.homeId, req.params.billId);
  sendSuccess(res, { bill }, 'Bill marked as paid successfully');
}

import { Router } from 'express';
import {
  createBillHandler,
  deleteBillHandler,
  getBillHandler,
  listBillsHandler,
  markBillPaidHandler,
  updateBillHandler,
} from '../controllers/billController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import { homeBillIdParamSchema, homeIdParamSchema } from '../validations/paramsValidation';
import { createBillSchema, listBillsQuerySchema, updateBillSchema } from '../validations/billValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router({ mergeParams: true });

router.get(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  validateQuery(listBillsQuerySchema),
  catchAsync(listBillsHandler),
);

router.post(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('member'),
  validateBody(createBillSchema),
  catchAsync(createBillHandler),
);

router.get(
  '/:billId',
  validateParams(homeBillIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getBillHandler),
);

router.patch(
  '/:billId',
  validateParams(homeBillIdParamSchema),
  requireHomeMembership('member'),
  validateBody(updateBillSchema),
  catchAsync(updateBillHandler),
);

router.delete(
  '/:billId',
  validateParams(homeBillIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(deleteBillHandler),
);

router.post(
  '/:billId/mark-paid',
  validateParams(homeBillIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(markBillPaidHandler),
);

export default router;

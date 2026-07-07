import type { Request, Response } from 'express';
import * as assetService from '../services/assetService';
import { sendSuccess } from '../utils/apiResponse';
import type {
  CreateAssetInput,
  ListAssetsQuery,
  UpdateAssetInput,
} from '../validations/assetValidation';

export async function listAssetsHandler(req: Request, res: Response) {
  const result = await assetService.listAssets(req.params.homeId, req.query as unknown as ListAssetsQuery);
  sendSuccess(res, result, 'Assets fetched successfully');
}

export async function createAssetHandler(req: Request, res: Response) {
  const asset = await assetService.createAsset(
    req.params.homeId,
    req.userId!,
    req.body as CreateAssetInput,
  );
  sendSuccess(res, { asset }, 'Asset created successfully', 201);
}

export async function getAssetHandler(req: Request, res: Response) {
  const asset = await assetService.getAsset(req.params.homeId, req.params.assetId);
  sendSuccess(res, { asset }, 'Asset fetched successfully');
}

export async function updateAssetHandler(req: Request, res: Response) {
  const asset = await assetService.updateAsset(
    req.params.homeId,
    req.params.assetId,
    req.body as UpdateAssetInput,
  );
  sendSuccess(res, { asset }, 'Asset updated successfully');
}

export async function deleteAssetHandler(req: Request, res: Response) {
  await assetService.deleteAsset(req.params.homeId, req.params.assetId);
  sendSuccess(res, null, 'Asset deleted successfully');
}

import type { Request, Response } from 'express';
import * as locationService from '../services/locationService';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateLocationInput, UpdateLocationInput } from '../validations/locationValidation';

export async function listLocationsHandler(req: Request, res: Response) {
  const locations = await locationService.listLocations(req.params.homeId);
  sendSuccess(res, { locations }, 'Locations fetched successfully');
}

export async function createLocationHandler(req: Request, res: Response) {
  const location = await locationService.createLocation(
    req.params.homeId,
    req.body as CreateLocationInput,
  );
  sendSuccess(res, { location }, 'Location created successfully', 201);
}

export async function updateLocationHandler(req: Request, res: Response) {
  const location = await locationService.updateLocation(
    req.params.homeId,
    req.params.locationId,
    req.body as UpdateLocationInput,
  );
  sendSuccess(res, { location }, 'Location updated successfully');
}

export async function deleteLocationHandler(req: Request, res: Response) {
  await locationService.deleteLocation(req.params.homeId, req.params.locationId);
  sendSuccess(res, null, 'Location deleted successfully');
}

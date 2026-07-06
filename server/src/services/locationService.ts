import { InventoryItem } from '../models/InventoryItem';
import { PantryLocation } from '../models/PantryLocation';
import { AppError } from '../middlewares/errorHandler';
import type { CreateLocationInput, UpdateLocationInput } from '../validations/locationValidation';

type LocationSummary = {
  id: string;
  name: string;
  type: string;
  order: number;
};

function toSummary(location: {
  _id: unknown;
  name: string;
  type: string;
  order: number;
}): LocationSummary {
  return {
    id: (location._id as { toString(): string }).toString(),
    name: location.name,
    type: location.type,
    order: location.order,
  };
}

export async function listLocations(homeId: string): Promise<LocationSummary[]> {
  const locations = await PantryLocation.find({ homeId }).sort({ order: 1, createdAt: 1 });
  return locations.map(toSummary);
}

export async function createLocation(
  homeId: string,
  input: CreateLocationInput,
): Promise<LocationSummary> {
  const order = input.order ?? (await PantryLocation.countDocuments({ homeId }));
  const location = await PantryLocation.create({ homeId, name: input.name, type: input.type, order });
  return toSummary(location);
}

async function findLocationOrThrow(homeId: string, locationId: string) {
  const location = await PantryLocation.findOne({ _id: locationId, homeId });
  if (!location) {
    throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
  }
  return location;
}

export async function updateLocation(
  homeId: string,
  locationId: string,
  input: UpdateLocationInput,
): Promise<LocationSummary> {
  const location = await findLocationOrThrow(homeId, locationId);

  if (input.name !== undefined) location.name = input.name;
  if (input.type !== undefined) location.type = input.type;
  if (input.order !== undefined) location.order = input.order;

  await location.save();
  return toSummary(location);
}

export async function deleteLocation(homeId: string, locationId: string): Promise<void> {
  const location = await findLocationOrThrow(homeId, locationId);

  const hasItems = await InventoryItem.exists({ locationId: location._id });
  if (hasItems) {
    throw new AppError(
      'Cannot delete a location that still has items',
      409,
      'LOCATION_NOT_EMPTY',
    );
  }

  await location.deleteOne();
}

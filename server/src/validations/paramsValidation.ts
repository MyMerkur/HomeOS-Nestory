import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid id format',
});

export const homeIdParamSchema = z.object({
  homeId: objectId,
});

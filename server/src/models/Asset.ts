import { Schema, model, type InferSchemaType } from 'mongoose';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '../constants/asset';

const assetSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: ASSET_CATEGORIES, required: true },
    room: { type: String, trim: true },
    brand: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    purchaseDate: { type: Date },
    price: { type: Number, min: 0 },
    warrantyEndDate: { type: Date },
    receiptImageUrl: { type: String },
    warrantyDocumentUrl: { type: String },
    notes: { type: String, maxlength: 500 },
    reminderDaysBefore: { type: [Number], default: [30, 7, 1, 0] },
    status: { type: String, enum: ASSET_STATUSES, default: 'active', index: true },
  },
  { timestamps: true },
);

assetSchema.index({ homeId: 1, status: 1 });
assetSchema.index({ homeId: 1, warrantyEndDate: 1 });

export type AssetDocument = InferSchemaType<typeof assetSchema>;
export const Asset = model('Asset', assetSchema);

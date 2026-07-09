import { Schema, model, type InferSchemaType } from 'mongoose';
import { BILL_CATEGORIES, BILL_STATUSES } from '../constants/bill';

const billSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: BILL_CATEGORIES, required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    status: { type: String, enum: BILL_STATUSES, default: 'unpaid', index: true },
    paidAt: { type: Date },
    reminderDaysBefore: { type: [Number], default: [3, 1, 0] },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

billSchema.index({ homeId: 1, status: 1 });
billSchema.index({ homeId: 1, dueDate: 1 });

export type BillDocument = InferSchemaType<typeof billSchema>;
export const Bill = model('Bill', billSchema);

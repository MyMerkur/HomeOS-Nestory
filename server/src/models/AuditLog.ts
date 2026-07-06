import { Schema, model, type InferSchemaType } from 'mongoose';

export const AUDIT_LOG_ACTIONS = ['consumed', 'discarded', 'frozen', 'added_to_shopping'] as const;

const auditLogSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: AUDIT_LOG_ACTIONS, required: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ homeId: 1, createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export const AuditLog = model('AuditLog', auditLogSchema);

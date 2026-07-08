import { Schema, model, type InferSchemaType } from 'mongoose';

const pushTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true },
    platform: { type: String, enum: ['ios', 'android'], required: true },
  },
  { timestamps: true },
);

pushTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

export type PushTokenDocument = InferSchemaType<typeof pushTokenSchema>;
export const PushToken = model('PushToken', pushTokenSchema);

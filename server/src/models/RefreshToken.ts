import { Schema, model, Types, type InferSchemaType } from 'mongoose';

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema> & {
  _id: Types.ObjectId;
};
export const RefreshToken = model('RefreshToken', refreshTokenSchema);

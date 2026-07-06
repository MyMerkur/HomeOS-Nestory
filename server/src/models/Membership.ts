import { Schema, model, type InferSchemaType } from 'mongoose';

const membershipSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      required: true,
      default: 'member',
    },
    status: {
      type: String,
      enum: ['active', 'invited', 'removed'],
      required: true,
      default: 'active',
    },
    joinedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

membershipSchema.index({ homeId: 1, userId: 1 }, { unique: true });

export type MembershipDocument = InferSchemaType<typeof membershipSchema>;
export const Membership = model('Membership', membershipSchema);

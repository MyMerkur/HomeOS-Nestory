import { Schema, model, type InferSchemaType } from 'mongoose';

const homeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    inviteCodeHash: { type: String, required: true, unique: true },
    defaultCurrency: { type: String, default: 'TRY' },
    timezone: { type: String, default: 'Europe/Istanbul' },
  },
  { timestamps: true },
);

export type HomeDocument = InferSchemaType<typeof homeSchema>;
export const Home = model('Home', homeSchema);

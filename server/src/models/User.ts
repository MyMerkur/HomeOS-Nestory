import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    settings: {
      language: { type: String, default: 'tr' },
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notificationPreferences: {
        expiryReminders: { type: Boolean, default: true },
        shoppingUpdates: { type: Boolean, default: true },
        weeklySummary: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);

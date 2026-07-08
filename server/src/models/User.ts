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
        reminderDaysBefore: { type: [Number], default: [7, 3, 1, 0] },
        dailyReminderEnabled: { type: Boolean, default: false },
        dailyReminderHour: { type: Number, default: 9, min: 0, max: 23 },
      },
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);

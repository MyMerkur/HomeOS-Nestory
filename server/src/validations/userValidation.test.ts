import { updateUserSettingsSchema } from './userValidation';

describe('updateUserSettingsSchema', () => {
  it('accepts every supported language code', () => {
    for (const language of ['en', 'tr', 'de', 'fr', 'es', 'it', 'cs', 'pt']) {
      expect(updateUserSettingsSchema.safeParse({ language }).success).toBe(true);
    }
  });

  it('rejects an unsupported language code', () => {
    expect(updateUserSettingsSchema.safeParse({ language: 'xx' }).success).toBe(false);
  });

  it('accepts valid notification reminder preferences', () => {
    const result = updateUserSettingsSchema.safeParse({
      notificationPreferences: {
        reminderDaysBefore: [7, 3, 1, 0],
        dailyReminderEnabled: true,
        dailyReminderHour: 20,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an out-of-range daily reminder hour', () => {
    const result = updateUserSettingsSchema.safeParse({
      notificationPreferences: { dailyReminderHour: 24 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative reminder day', () => {
    const result = updateUserSettingsSchema.safeParse({
      notificationPreferences: { reminderDaysBefore: [-1] },
    });
    expect(result.success).toBe(false);
  });
});

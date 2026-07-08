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
});

module.exports = {
  getLocales: () => [{ countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false }],
  findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
};

const TextRecognition = {
  recognize: jest.fn(() => Promise.resolve({ text: '', blocks: [] })),
};

module.exports = TextRecognition;
module.exports.default = TextRecognition;
module.exports.TextRecognitionScript = { LATIN: 'Latin' };

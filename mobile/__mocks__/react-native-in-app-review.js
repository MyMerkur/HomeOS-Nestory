const InAppReview = {
  isAvailable: jest.fn(() => true),
  RequestInAppReview: jest.fn(() => Promise.resolve(true)),
  requestInAppCommentAppGallery: jest.fn(() => Promise.resolve()),
};

module.exports = InAppReview;
module.exports.default = InAppReview;

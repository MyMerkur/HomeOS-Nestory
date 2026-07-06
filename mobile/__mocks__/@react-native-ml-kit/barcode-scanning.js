const BarcodeScanning = {
  scan: jest.fn(() => Promise.resolve([])),
};

module.exports = BarcodeScanning;
module.exports.default = BarcodeScanning;
module.exports.BarcodeFormat = { UNKNOWN: -1, ALL_FORMATS: 0 };

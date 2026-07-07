import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { launchCamera } from 'react-native-image-picker';
import { scanBarcodeFromCamera } from './barcodeScanner';

jest.mock('react-native-image-picker');
jest.mock('@react-native-ml-kit/barcode-scanning');

describe('scanBarcodeFromCamera', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cancelled when the camera capture is cancelled', async () => {
    (launchCamera as jest.Mock).mockResolvedValue({ didCancel: true });

    const result = await scanBarcodeFromCamera();

    expect(result).toEqual({ status: 'cancelled' });
    expect(BarcodeScanning.scan).not.toHaveBeenCalled();
  });

  it('returns not-found when no barcode is recognized in the photo', async () => {
    (launchCamera as jest.Mock).mockResolvedValue({ assets: [{ uri: 'file://photo.jpg' }] });
    (BarcodeScanning.scan as jest.Mock).mockResolvedValue([]);

    const result = await scanBarcodeFromCamera();

    expect(result).toEqual({ status: 'not-found' });
  });

  it('returns the recognized barcode value', async () => {
    (launchCamera as jest.Mock).mockResolvedValue({ assets: [{ uri: 'file://photo.jpg' }] });
    (BarcodeScanning.scan as jest.Mock).mockResolvedValue([{ format: 'EAN_13', value: '8690123456789' }]);

    const result = await scanBarcodeFromCamera();

    expect(BarcodeScanning.scan).toHaveBeenCalledWith('file://photo.jpg');
    expect(result).toEqual({ status: 'found', value: '8690123456789' });
  });
});

import TextRecognition from '@react-native-ml-kit/text-recognition';
import { launchCamera } from 'react-native-image-picker';
import { parseExpiryDateFromText, scanExpiryDateFromCamera } from './dateOcrScanner';

jest.mock('react-native-image-picker');

describe('parseExpiryDateFromText', () => {
  it('parses a dd.mm.yyyy date', () => {
    const date = parseExpiryDateFromText('SKT: 25.12.2026 Parti No: 4471');
    expect(date).toEqual(new Date(2026, 11, 25));
  });

  it('parses a dd/mm/yy date', () => {
    const date = parseExpiryDateFromText('EXP 05/03/27');
    expect(date).toEqual(new Date(2027, 2, 5));
  });

  it('returns null when no date-like pattern is present', () => {
    expect(parseExpiryDateFromText('Süt 1 Litre Yağlı')).toBeNull();
  });

  it('returns null for an invalid calendar date', () => {
    expect(parseExpiryDateFromText('35.13.2026')).toBeNull();
  });

  it('picks the first match when multiple date-like strings exist', () => {
    const date = parseExpiryDateFromText('Üretim: 01.01.2026 SKT: 01.06.2026');
    expect(date).toEqual(new Date(2026, 0, 1));
  });
});

describe('scanExpiryDateFromCamera', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when the camera capture is cancelled', async () => {
    (launchCamera as jest.Mock).mockResolvedValue({ didCancel: true });

    const result = await scanExpiryDateFromCamera();

    expect(result).toBeNull();
    expect(TextRecognition.recognize).not.toHaveBeenCalled();
  });

  it('recognizes text from the captured photo and extracts a date', async () => {
    (launchCamera as jest.Mock).mockResolvedValue({
      assets: [{ uri: 'file://photo.jpg' }],
    });
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({
      text: 'SKT 10.10.2026',
      blocks: [],
    });

    const result = await scanExpiryDateFromCamera();

    expect(TextRecognition.recognize).toHaveBeenCalledWith('file://photo.jpg');
    expect(result).toEqual(new Date(2026, 9, 10));
  });
});

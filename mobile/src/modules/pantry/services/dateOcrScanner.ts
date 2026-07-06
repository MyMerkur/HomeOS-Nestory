import TextRecognition from '@react-native-ml-kit/text-recognition';
import { captureImage } from '../../../services/cameraCapture';

const DATE_PATTERN = /\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/;

export function parseExpiryDateFromText(text: string): Date | null {
  const match = text.match(DATE_PATTERN);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = Number(match[3]);
  if (year < 100) year += 2000;

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValid ? date : null;
}

export async function scanExpiryDateFromCamera(): Promise<Date | null> {
  const uri = await captureImage();
  if (!uri) return null;

  const result = await TextRecognition.recognize(uri);
  return parseExpiryDateFromText(result.text);
}

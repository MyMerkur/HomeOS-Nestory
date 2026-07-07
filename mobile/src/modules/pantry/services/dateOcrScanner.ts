import TextRecognition from '@react-native-ml-kit/text-recognition';
import { captureImage } from '../../../services/cameraCapture';

const DATE_PATTERN = /\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b|\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g;
const EXPIRY_KEYWORD_PATTERN = /skt|son kullanma|exp|use by|expiry/i;

export type ExpiryDateScanOutcome =
  | { status: 'found'; date: Date }
  | { status: 'not-found' }
  | { status: 'cancelled' };

function toValidDate(day: number, month: number, year: number): Date | null {
  if (year < 100) year += 2000;
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isValid ? date : null;
}

interface Candidate {
  date: Date;
  index: number;
}

function findCandidates(text: string): Candidate[] {
  const candidates: Candidate[] = [];
  for (const match of text.matchAll(DATE_PATTERN)) {
    const [, day, month, year, isoYear, isoMonth, isoDay] = match;
    const date = isoYear
      ? toValidDate(Number(isoDay), Number(isoMonth), Number(isoYear))
      : toValidDate(Number(day), Number(month), Number(year));
    if (date) candidates.push({ date, index: match.index ?? 0 });
  }
  return candidates;
}

export function parseExpiryDateFromText(text: string): Date | null {
  const candidates = findCandidates(text);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0].date;

  const keywordMatch = text.match(EXPIRY_KEYWORD_PATTERN);
  if (keywordMatch && keywordMatch.index !== undefined) {
    const keywordIndex = keywordMatch.index;
    const nearest = candidates.reduce((closest, candidate) =>
      Math.abs(candidate.index - keywordIndex) < Math.abs(closest.index - keywordIndex)
        ? candidate
        : closest,
    );
    return nearest.date;
  }

  // No keyword to anchor on: packaging that prints two dates almost always
  // has the expiry date after the production date.
  return candidates.reduce((latest, candidate) =>
    candidate.date > latest.date ? candidate : latest,
  ).date;
}

export async function scanExpiryDateFromCamera(): Promise<ExpiryDateScanOutcome> {
  const uri = await captureImage();
  if (!uri) return { status: 'cancelled' };

  const result = await TextRecognition.recognize(uri);
  const date = parseExpiryDateFromText(result.text);
  return date ? { status: 'found', date } : { status: 'not-found' };
}

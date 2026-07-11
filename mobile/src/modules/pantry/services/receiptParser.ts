// Fiş OCR metni gürültülü ve mağazaya göre çok değişken olduğu için bu
// sezgisel bir filtre — kesin bir ayrıştırıcı değil. Kullanıcı, tespit
// edilen satırları eklemeden önce ekranda gözden geçirip düzenler/kaldırır.
//
// Not: normalize edilmiş (Türkçe kurallarıyla küçültülmüş) metin üzerinde
// eşleştirme yapılıyor — "İ".toLowerCase() (locale'siz) "i̇" (nokta
// birleşik) üretir, "İ" ↔ "i" eşleşmesini bozar (bilinen "Turkish I
// problem"). `toLocaleLowerCase('tr-TR')` bunu doğru şekilde çözüyor.
const NOISE_LINE_PATTERN =
  /toplam|ara toplam|kdv|nakit|kredi kart|para üstü|fiş no|fatura no|tarih|saat|mersis|vkn|tckn|adres|tel:|teşekkür|subtotal|total|\bvat\b|\btax\b|\bcash\b|\bchange\b|thank you|receipt/;
const ONLY_SYMBOLS_OR_DIGITS_PATTERN = /^[\d\s.,:%*/₺$€xX-]+$/;
const MAX_LINES = 40;
const MIN_LINE_LENGTH = 3;

// Matches a trailing price like "45,90", "1.234,56" or "45.90", optionally
// followed by a currency symbol/code — the price a POS receipt line usually
// ends with (unit price/quantity columns, if present, come before this).
const TRAILING_PRICE_PATTERN = /(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s*(?:₺|TL)?\s*$/i;

function parsePriceToken(token: string): number {
  if (token.includes(',')) {
    // Turkish convention: '.' is the thousands separator, ',' is decimal.
    return Number(token.replace(/\./g, '').replace(',', '.'));
  }
  // No comma present — the token is already valid float syntax (e.g. "45.90").
  return Number(token);
}

export type ReceiptLine = { name: string; price?: number };

function splitNameAndPrice(line: string): ReceiptLine {
  const match = line.match(TRAILING_PRICE_PATTERN);
  if (!match) return { name: line };

  const price = parsePriceToken(match[1]);
  const name = line.slice(0, match.index).trim();
  if (!Number.isFinite(price) || price <= 0 || name.length < MIN_LINE_LENGTH) {
    return { name: line };
  }

  return { name, price };
}

export function parseReceiptLines(rawText: string): ReceiptLine[] {
  const seen = new Set<string>();
  const candidates: ReceiptLine[] = [];

  for (const rawLine of rawText.split('\n')) {
    const line = rawLine.trim();
    if (line.length < MIN_LINE_LENGTH) continue;
    if (ONLY_SYMBOLS_OR_DIGITS_PATTERN.test(line)) continue;

    const normalized = line.toLocaleLowerCase('tr-TR');
    if (NOISE_LINE_PATTERN.test(normalized)) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    candidates.push(splitNameAndPrice(line));
    if (candidates.length >= MAX_LINES) break;
  }

  return candidates;
}

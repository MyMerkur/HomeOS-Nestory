import { parseReceiptLines } from './receiptParser';

describe('parseReceiptLines', () => {
  it('keeps plausible product name lines', () => {
    const text = 'MIGROS ŞUBE 123\nSüt Tam Yağlı 1L\nEkmek Tam Buğday\nYumurta 10lu';

    const result = parseReceiptLines(text);

    expect(result).toContain('Süt Tam Yağlı 1L');
    expect(result).toContain('Ekmek Tam Buğday');
    expect(result).toContain('Yumurta 10lu');
  });

  it('filters out price-only and symbol-only lines', () => {
    const text = 'Süt Tam Yağlı 1L\n12,50\n*** 3 X 5,00 ***\n--------';

    const result = parseReceiptLines(text);

    expect(result).toEqual(['Süt Tam Yağlı 1L']);
  });

  it('filters out common receipt boilerplate lines', () => {
    const text = [
      'Süt Tam Yağlı 1L',
      'ARA TOPLAM',
      'KDV %8',
      'NAKİT',
      'PARA ÜSTÜ',
      'TOPLAM',
      'FİŞ NO: 00123',
      'TARİH: 10.07.2026',
      'TEŞEKKÜR EDERİZ',
    ].join('\n');

    const result = parseReceiptLines(text);

    expect(result).toEqual(['Süt Tam Yağlı 1L']);
  });

  it('drops very short lines', () => {
    const text = 'Süt Tam Yağlı 1L\nA\nBC';

    const result = parseReceiptLines(text);

    expect(result).toEqual(['Süt Tam Yağlı 1L']);
  });

  it('deduplicates case-insensitively while preserving first casing', () => {
    const text = 'Süt Tam Yağlı 1L\nsüt tam yağlı 1l\nEkmek';

    const result = parseReceiptLines(text);

    expect(result).toEqual(['Süt Tam Yağlı 1L', 'Ekmek']);
  });

  it('caps the number of returned candidate lines', () => {
    const lines = Array.from({ length: 60 }, (_, i) => `Ürün ${i}`).join('\n');

    const result = parseReceiptLines(lines);

    expect(result).toHaveLength(40);
  });

  it('returns an empty array for a receipt with no plausible product lines', () => {
    const text = 'TOPLAM\nKDV\nNAKİT\n12,50\n----';

    expect(parseReceiptLines(text)).toEqual([]);
  });
});

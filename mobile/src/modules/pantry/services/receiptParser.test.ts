import { parseReceiptLines } from './receiptParser';

describe('parseReceiptLines', () => {
  it('keeps plausible product name lines', () => {
    const text = 'MIGROS ŞUBE 123\nSüt Tam Yağlı 1L\nEkmek Tam Buğday\nYumurta 10lu';

    const result = parseReceiptLines(text);

    expect(result).toContainEqual({ name: 'Süt Tam Yağlı 1L' });
    expect(result).toContainEqual({ name: 'Ekmek Tam Buğday' });
    expect(result).toContainEqual({ name: 'Yumurta 10lu' });
  });

  it('filters out price-only and symbol-only lines', () => {
    const text = 'Süt Tam Yağlı 1L\n12,50\n*** 3 X 5,00 ***\n--------';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Süt Tam Yağlı 1L' }]);
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

    expect(result).toEqual([{ name: 'Süt Tam Yağlı 1L' }]);
  });

  it('drops very short lines', () => {
    const text = 'Süt Tam Yağlı 1L\nA\nBC';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Süt Tam Yağlı 1L' }]);
  });

  it('deduplicates case-insensitively while preserving first casing', () => {
    const text = 'Süt Tam Yağlı 1L\nsüt tam yağlı 1l\nEkmek';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Süt Tam Yağlı 1L' }, { name: 'Ekmek' }]);
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

  it('extracts a trailing Turkish-formatted price and strips it from the name', () => {
    const text = 'Süt Tam Yağlı 1L        45,90';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Süt Tam Yağlı 1L', price: 45.9 }]);
  });

  it('extracts a trailing dot-formatted price', () => {
    const text = 'Ekmek 12.50';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Ekmek', price: 12.5 }]);
  });

  it('normalizes a thousands-separated price', () => {
    const text = 'Pahalı Ürün 1.234,56';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Pahalı Ürün', price: 1234.56 }]);
  });

  it('strips a trailing currency symbol after the price', () => {
    const text = 'Kahve 65,00 TL';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'Kahve', price: 65 }]);
  });

  it('falls back to the whole line as the name when stripping the price would leave too little text', () => {
    const text = 'AB 12,50';

    const result = parseReceiptLines(text);

    expect(result).toEqual([{ name: 'AB 12,50' }]);
  });
});

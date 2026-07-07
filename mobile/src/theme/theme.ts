// HomeOS / Nestory — Tasarım Tokenları
// Tek kaynak: tüm renk, tipografi, spacing ve radius değerleri buradan gelir.
// Ekranlarda ASLA ham hex kullanılmaz, her zaman bu dosyadan import edilir.

export const colors = {
  // Marka
  primary: '#4B7F52', // taze/moss yeşil — ana aksiyon, aktif tab, FAB
  primaryTint: '#E8F0E4', // yeşil rozet/kart arka planı
  primaryDark: '#2C4A30', // yeşil rozet üzerindeki metin

  danger: '#D95D4A', // SKT yaklaşan / kritik uyarı
  dangerTint: '#FBEAE6',
  dangerDark: '#8C3323',

  warning: '#D9A441', // orta vadeli uyarı, rozet/streak
  warningTint: '#FAF1DD',
  warningDark: '#845108',

  // Nötr / arkaplan
  background: '#FAFAF9', // ekran arka planı (neredeyse saf beyaz)
  surface: '#FFFFFF', // kart, tab bar, header
  border: '#ECEAE4', // ayraç çizgileri, ince kenarlıklar
  borderStrong: '#DEDCD4', // input kenarlığı, segmented control

  textPrimary: '#24312A', // ana metin (saf siyah değil, koyu orman tonu)
  textSecondary: '#5B6B60', // ikincil metin, alt başlıklar
  textMuted: '#9A988F', // pasif ikon, placeholder, disabled

  white: '#FFFFFF',
} as const;

export const typography = {
  display: {
    fontFamily: 'Baloo2-Bold', // marka adı, büyük sayılar, ekran başlıkları
    fontWeight: '700' as const,
  },
  heading: {
    fontFamily: 'Baloo2-SemiBold', // bölüm başlıkları (örn. "Bugün dikkat")
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'Inter-Regular', // gövde metni, liste satırları
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: 'Inter-Medium', // ürün adı, buton yazısı
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: 'Inter-Regular', // alt bilgi, tarih, birim
    fontWeight: '400' as const,
  },
};

export const fontSize = {
  displayLg: 22, // ekran başlığı (örn. "Kiler")
  displayMd: 19, // marka adı / dashboard başlığı
  bodyLg: 15, // input, buton metni
  bodyMd: 13, // ürün adı, liste başlığı
  bodySm: 12, // bölüm alt başlıkları
  caption: 11, // alt bilgi, minimum okunabilir boyut
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
  card: 14,
};

// Tazelik halkası renk eşiği — gün sayısına göre hangi renk kullanılacağını belirler.
// item.daysUntilExpiry değerine göre çağrılır.
export function freshnessColor(daysUntilExpiry: number): string {
  if (daysUntilExpiry <= 1) return colors.danger;
  if (daysUntilExpiry <= 4) return colors.warning;
  return colors.primary;
}

export default { colors, typography, fontSize, spacing, radius, freshnessColor };

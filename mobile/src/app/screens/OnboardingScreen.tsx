import type { ComponentType } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { IconBarcode, IconBell, IconFridge, IconUsers } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/Button';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';

type IconProps = { color: string; size: number };

type Slide = { key: string; icon: ComponentType<IconProps>; titleKey: string; bodyKey: string };

const SLIDES: Slide[] = [
  { key: 'pantry', icon: IconFridge, titleKey: 'welcomeTour.pantry.title', bodyKey: 'welcomeTour.pantry.body' },
  { key: 'barcode', icon: IconBarcode, titleKey: 'welcomeTour.barcode.title', bodyKey: 'welcomeTour.barcode.body' },
  { key: 'family', icon: IconUsers, titleKey: 'welcomeTour.family.title', bodyKey: 'welcomeTour.family.body' },
  { key: 'reminders', icon: IconBell, titleKey: 'welcomeTour.reminders.title', bodyKey: 'welcomeTour.reminders.body' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = { onDone: () => void };

export function OnboardingScreen({ onDone }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (first && typeof first.index === 'number') setActiveIndex(first.index);
  }).current;

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onDone();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1 });
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <Pressable testID="onboarding-skip" style={styles.skip} onPress={onDone}>
        <Text style={styles.skipLabel}>{t('welcomeTour.skip')}</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(slide) => slide.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]} testID={`onboarding-slide-${item.key}`}>
            <View style={styles.iconWrap}>
              <item.icon color={colors.primary} size={56} />
            </View>
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.body}>{t(item.bodyKey)}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((slide, index) => (
          <View
            key={slide.key}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          testID="onboarding-next"
          label={isLastSlide ? t('welcomeTour.getStarted') : t('welcomeTour.next')}
          onPress={handleNext}
          variant="primary"
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    skip: { alignSelf: 'flex-end', padding: spacing.lg },
    skipLabel: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textMuted,
    },
    slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.lg },
    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: radius.pill,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: fontSize.displayMd,
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    body: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.lg },
    dot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.border },
    dotActive: { backgroundColor: colors.primary, width: 20 },
    footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  });
}

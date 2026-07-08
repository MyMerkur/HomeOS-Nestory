import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../ui/Card';
import { Skeleton } from '../../../ui/Skeleton';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useBadgesQuery } from '../hooks/useBadgesQuery';
import type { Badge } from '../services/badgeApi';

function BadgesScreenSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.list}>
      <Skeleton height={64} style={styles.card} />
      <Skeleton height={64} style={styles.card} />
      <Skeleton height={64} style={styles.card} />
      <Skeleton height={64} style={styles.card} />
    </View>
  );
}

function BadgeCard({ badge, styles }: { badge: Badge; styles: ReturnType<typeof createStyles> }) {
  return (
    <Card tint={badge.earned ? 'primary' : 'default'} style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.name, badge.earned && styles.nameEarned]}>
          {badge.earned ? '✓ ' : ''}
          {badge.name}
        </Text>
        <Text style={styles.description}>{badge.description}</Text>
      </View>
      <Text style={styles.progress}>
        {badge.progress}/{badge.target}
      </Text>
    </Card>
  );
}

export function BadgesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: badges, isLoading, isError, refetch, isRefetching } = useBadgesQuery();

  if (isLoading) {
    return <BadgesScreenSkeleton styles={styles} />;
  }

  if (isError || !badges) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{t('badges.errorLoad')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="badges-list"
      data={badges}
      keyExtractor={(badge) => badge.id}
      contentContainerStyle={styles.list}
      refreshing={isRefetching}
      onRefresh={refetch}
      renderItem={({ item }) => <BadgeCard badge={item} styles={styles} />}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    list: { padding: spacing.lg, gap: spacing.sm },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
    info: { flex: 1, gap: 2 },
    name: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textMuted,
    },
    nameEarned: { color: colors.primaryDark },
    description: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.textSecondary,
    },
    progress: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
  });
}

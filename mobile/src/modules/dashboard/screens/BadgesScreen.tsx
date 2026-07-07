import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../ui/Card';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useBadgesQuery } from '../hooks/useBadgesQuery';
import type { Badge } from '../services/badgeApi';

function BadgeCard({ badge }: { badge: Badge }) {
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
  const { data: badges, isLoading, isError } = useBadgesQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !badges) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Rozetler yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={badges}
      keyExtractor={(badge) => badge.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <BadgeCard badge={item} />}
    />
  );
}

const styles = StyleSheet.create({
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

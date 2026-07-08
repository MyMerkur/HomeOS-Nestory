import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconMoodEmpty } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { ItemCard } from '../../pantry/components/ItemCard';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { SummaryCard } from '../../../ui/SummaryCard';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useDashboardQuery } from '../hooks/useDashboardQuery';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

export function DashboardScreen({ navigation }: DashboardStackScreenProps<'Dashboard'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data, isLoading, isError } = useDashboardQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{t('dashboard.errorLoad')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shortcutsRow}>
        <Chip
          testID="go-to-badges"
          label={t('dashboard.shortcuts.badges')}
          onPress={() => navigation.navigate('Badges')}
        />
        <Chip
          testID="go-to-medicines"
          label={t('dashboard.shortcuts.medicines')}
          onPress={() => navigation.navigate('Medicines')}
        />
        <Chip
          testID="go-to-assets"
          label={t('dashboard.shortcuts.assets')}
          onPress={() => navigation.navigate('Assets')}
        />
        <Chip
          testID="go-to-family"
          label={t('dashboard.shortcuts.family')}
          onPress={() => navigation.navigate('Family')}
        />
        <Chip
          testID="go-to-settings"
          label={t('dashboard.shortcuts.settings')}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard value={data.expiringToday} caption={t('dashboard.summary.today')} tint="danger" />
        <SummaryCard value={data.expiringIn3Days} caption={t('dashboard.summary.in3Days')} tint="warning" />
        <SummaryCard value={data.expiringInWeek} caption={t('dashboard.summary.inWeek')} tint="warning" />
        <SummaryCard value={data.totalActive} caption={t('dashboard.summary.total')} tint="primary" />
      </View>

      <Text style={styles.sectionTitle}>{t('dashboard.upcomingTitle')}</Text>

      {data.upcomingItems.length === 0 ? (
        <EmptyState icon={IconMoodEmpty} title={t('dashboard.emptyUpcoming')} />
      ) : (
        <FlatList
          data={data.upcomingItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() =>
                navigation.navigate('PantryTab', { screen: 'ItemForm', params: { itemId: item.id } })
              }
            />
          )}
        />
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    shortcutsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      margin: spacing.md,
    },
    summaryRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm },
    sectionTitle: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
      marginBottom: spacing.xs,
    },
    list: { paddingHorizontal: spacing.lg },
  });
}

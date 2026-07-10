import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  IconAward,
  IconDevices,
  IconMenu2,
  IconMoodEmpty,
  IconPill,
  IconReceipt2,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { ItemCard } from '../../pantry/components/ItemCard';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { Skeleton } from '../../../ui/Skeleton';
import { SideMenu } from '../../../ui/SideMenu';
import { SummaryCard } from '../../../ui/SummaryCard';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useDashboardQuery } from '../hooks/useDashboardQuery';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

function DashboardSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} height={72} style={styles.summarySkeleton} />
        ))}
      </View>
      <View style={styles.summaryRow}>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} height={72} style={styles.summarySkeleton} />
        ))}
      </View>
      <View style={styles.summaryRow}>
        {[0, 1].map((key) => (
          <Skeleton key={key} height={72} style={styles.summarySkeleton} />
        ))}
      </View>
      <View style={styles.list}>
        <Skeleton height={64} style={styles.rowSkeleton} />
        <Skeleton height={64} style={styles.rowSkeleton} />
        <Skeleton height={64} style={styles.rowSkeleton} />
      </View>
    </View>
  );
}

function MenuButton({ onPress, colors }: { onPress: () => void; colors: ThemeColors }) {
  return (
    <Pressable testID="open-side-menu" onPress={onPress} hitSlop={12} style={menuButtonStyle}>
      <IconMenu2 color={colors.primary} size={24} />
    </Pressable>
  );
}

const menuButtonStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.xs,
};

export function DashboardScreen({ navigation }: DashboardStackScreenProps<'Dashboard'>) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data, isLoading, isError, refetch, isRefetching } = useDashboardQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topBar = <MenuButton onPress={() => setIsMenuOpen(true)} colors={colors} />;

  const menuItems = [
    { testID: 'go-to-badges', label: t('dashboard.shortcuts.badges'), icon: IconAward, onPress: () => navigation.navigate('Badges') },
    { testID: 'go-to-medicines', label: t('dashboard.shortcuts.medicines'), icon: IconPill, onPress: () => navigation.navigate('Medicines') },
    { testID: 'go-to-assets', label: t('dashboard.shortcuts.assets'), icon: IconDevices, onPress: () => navigation.navigate('Assets') },
    { testID: 'go-to-bills', label: t('dashboard.shortcuts.bills'), icon: IconReceipt2, onPress: () => navigation.navigate('Bills') },
    { testID: 'go-to-family', label: t('dashboard.shortcuts.family'), icon: IconUsers, onPress: () => navigation.navigate('Family') },
    { testID: 'go-to-settings', label: t('dashboard.shortcuts.settings'), icon: IconSettings, onPress: () => navigation.navigate('Settings') },
  ];

  const menu = (
    <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} colors={colors} />
  );

  if (isLoading) {
    return (
      <>
        {topBar}
        <DashboardSkeleton styles={styles} />
        {menu}
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        {topBar}
        <View style={styles.centered}>
          <Text style={styles.error}>{t('dashboard.errorLoad')}</Text>
          <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
        </View>
        {menu}
      </>
    );
  }

  return (
    <>
      {topBar}
      <FlatList
        testID="dashboard-list"
        style={styles.container}
        data={data.upcomingItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <View style={styles.summaryRow}>
              <SummaryCard value={data.expiringToday} caption={t('dashboard.summary.today')} tint="danger" />
              <SummaryCard
                value={data.expiringIn3Days}
                caption={t('dashboard.summary.in3Days')}
                tint="warning"
              />
              <SummaryCard
                value={data.expiringInWeek}
                caption={t('dashboard.summary.inWeek')}
                tint="warning"
              />
              <SummaryCard value={data.totalActive} caption={t('dashboard.summary.total')} tint="primary" />
            </View>

            <View style={styles.summaryRow}>
              <SummaryCard
                value={data.pantryItemCount}
                caption={t('dashboard.summary.pantryItems')}
                tint="primary"
              />
              <SummaryCard
                value={data.medicineCount}
                caption={t('dashboard.summary.medicines')}
                tint="primary"
              />
              <SummaryCard value={data.assetCount} caption={t('dashboard.summary.assets')} tint="primary" />
            </View>

            <View style={styles.summaryRow}>
              <SummaryCard
                value={`${data.spending.paidThisMonth.toLocaleString(i18n.language)} ₺`}
                caption={t('dashboard.summary.paidThisMonth')}
                tint="primary"
              />
              <SummaryCard
                value={`${data.spending.unpaidTotal.toLocaleString(i18n.language)} ₺`}
                caption={t('dashboard.summary.unpaidTotal')}
                tint="warning"
              />
            </View>

            <Text style={styles.sectionTitle}>{t('dashboard.upcomingTitle')}</Text>
          </>
        }
        ListEmptyComponent={<EmptyState icon={IconMoodEmpty} title={t('dashboard.emptyUpcoming')} />}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() =>
              navigation.navigate('PantryTab', { screen: 'ItemForm', params: { itemId: item.id } })
            }
          />
        )}
      />
      {menu}
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    summaryRow: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
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
    summarySkeleton: { flex: 1 },
    rowSkeleton: { marginBottom: spacing.sm },
  });
}

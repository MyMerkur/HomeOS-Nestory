import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconPlus, IconReceipt2 } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { BillStatusBadge } from '../components/BillStatusBadge';
import { BILLS_QUERY_KEY, useBillsQuery } from '../hooks/useBillsQuery';
import { deleteBill, markBillPaid, type Bill } from '../services/billApi';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { FAB } from '../../../ui/FAB';
import { Skeleton } from '../../../ui/Skeleton';
import { triggerHaptic } from '../../../services/haptics';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

function BillsScreenSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.list}>
      <Skeleton height={60} style={styles.skeletonRow} />
      <Skeleton height={60} style={styles.skeletonRow} />
      <Skeleton height={60} style={styles.skeletonRow} />
      <Skeleton height={60} style={styles.skeletonRow} />
    </View>
  );
}

function BillCard({ bill, onPress, onLongPress }: { bill: Bill; onPress: () => void; onLongPress: () => void }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable testID={`bill-card-${bill.id}`} style={styles.card} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{bill.name}</Text>
        <Text style={styles.meta}>
          {t(`bills.categories.${bill.category}`)} · {new Date(bill.dueDate).toLocaleDateString(i18n.language)}
          {bill.isRecurring ? ` · ${t('bills.recurringTag')}` : ''}
        </Text>
        <Text style={styles.amount}>{bill.amount.toLocaleString(i18n.language)} ₺</Text>
      </View>
      <BillStatusBadge status={bill.status} dueDate={bill.dueDate} />
    </Pressable>
  );
}

export function BillsScreen({ navigation }: DashboardStackScreenProps<'Bills'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch, isRefetching } = useBillsQuery({ limit: 100 });

  const handleBillAction = (bill: Bill) => {
    const options = [];
    if (bill.status === 'unpaid') {
      options.push({
        text: t('bills.markPaidAction'),
        onPress: async () => {
          await markBillPaid(homeId, bill.id);
          triggerHaptic('notificationSuccess');
          await queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
        },
      });
    }
    options.push(
      {
        text: t('bills.deleteAction'),
        style: 'destructive' as const,
        onPress: async () => {
          await deleteBill(homeId, bill.id);
          await queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
        },
      },
      { text: t('bills.cancelAction'), style: 'cancel' as const },
    );

    Alert.alert(bill.name, undefined, options);
  };

  if (isLoading) {
    return <BillsScreenSkeleton styles={styles} />;
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{t('bills.errorLoad')}</Text>
        <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.bills.length === 0 ? (
        <EmptyState icon={IconReceipt2} title={t('bills.emptyList')} />
      ) : (
        <FlatList
          testID="bills-list"
          data={data.bills}
          keyExtractor={(bill) => bill.id}
          contentContainerStyle={styles.list}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <BillCard
              bill={item}
              onPress={() => navigation.navigate('BillForm', { billId: item.id })}
              onLongPress={() => handleBillAction(item)}
            />
          )}
        />
      )}

      <FAB
        testID="add-bill-button"
        icon={IconPlus}
        accessibilityLabel={t('bills.addA11y')}
        onPress={() => navigation.navigate('BillForm', undefined)}
      />
    </View>
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
    list: { paddingHorizontal: spacing.lg },
    skeletonRow: { marginBottom: spacing.sm },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      minHeight: 44,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    info: { flex: 1, gap: 2 },
    name: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
    meta: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.textSecondary,
    },
    amount: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
  });
}

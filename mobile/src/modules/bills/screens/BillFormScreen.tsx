import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { BILL_CATEGORIES } from '../constants';
import { BILLS_QUERY_KEY } from '../hooks/useBillsQuery';
import { createBill, getBill, updateBill } from '../services/billApi';
import { makeBillFormSchema, type BillFormValues } from '../schemas/billSchema';
import { triggerHaptic } from '../../../services/haptics';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

export function BillFormScreen({ navigation, route }: DashboardStackScreenProps<'BillForm'>) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const billId = route.params?.billId;
  const isEditMode = !!billId;
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();

  const { data: existingBill, isLoading: isLoadingBill } = useQuery({
    queryKey: ['bill', homeId, billId],
    queryFn: () => getBill(homeId, billId as string),
    enabled: isEditMode,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillFormValues>({
    resolver: zodResolver(makeBillFormSchema(t)),
    defaultValues: { name: '', category: undefined, amount: undefined, isRecurring: false },
  });

  useEffect(() => {
    navigation.setOptions({ title: isEditMode ? t('bills.form.titleEdit') : t('bills.form.titleAdd') });
  }, [navigation, isEditMode, t]);

  useEffect(() => {
    if (existingBill) {
      reset({
        name: existingBill.name,
        category: existingBill.category,
        amount: existingBill.amount,
        dueDate: new Date(existingBill.dueDate),
        isRecurring: existingBill.isRecurring,
        notes: existingBill.notes ?? undefined,
      });
    }
  }, [existingBill, reset]);

  const onSubmit = async (values: BillFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        category: values.category,
        amount: values.amount,
        dueDate: values.dueDate.toISOString(),
        isRecurring: values.isRecurring,
        notes: values.notes,
      };

      if (isEditMode) {
        await updateBill(homeId, billId as string, payload);
      } else {
        await createBill(homeId, payload);
      }

      triggerHaptic('notificationSuccess');
      await queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError(t('bills.form.errorSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingBill) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('bills.form.nameLabel')}
              placeholder={t('bills.form.namePlaceholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Text style={styles.label}>{t('bills.form.categoryLabel')}</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipsRow}>
              {BILL_CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  testID={`bill-category-chip-${category}`}
                  label={t(`bills.categories.${category}`)}
                  selected={value === category}
                  onPress={() => onChange(category)}
                />
              ))}
            </View>
          )}
        />
        {errors.category ? <Text style={styles.error}>{errors.category.message}</Text> : null}

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('bills.form.amountLabel')}
              keyboardType="numeric"
              value={value === undefined ? '' : String(value)}
              onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
              onBlur={onBlur}
              error={errors.amount?.message}
            />
          )}
        />

        <Text style={styles.label}>{t('bills.form.dueDateLabel')}</Text>
        <Controller
          control={control}
          name="dueDate"
          render={({ field: { onChange, value } }) => (
            <>
              <Pressable
                testID="due-date-button"
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {value ? value.toLocaleDateString(i18n.language) : t('bills.form.selectDateButton')}
                </Text>
              </Pressable>
              {showDatePicker ? (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  locale={i18n.language}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              ) : null}
            </>
          )}
        />
        {errors.dueDate ? <Text style={styles.error}>{errors.dueDate.message}</Text> : null}

        <View style={styles.switchRow}>
          <Text style={styles.label}>{t('bills.form.recurringLabel')}</Text>
          <Controller
            control={control}
            name="isRecurring"
            render={({ field: { onChange, value } }) => (
              <Switch
                testID="bill-recurring-switch"
                value={value ?? false}
                onValueChange={onChange}
                trackColor={{ true: colors.primary }}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('bills.form.notesLabel')}
              multiline
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

        <View style={styles.submitButton}>
          <Button
            testID="bill-form-submit"
            label={isEditMode ? t('bills.form.submitEdit') : t('bills.form.submitAdd')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    label: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
    error: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.dangerDark,
    },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    dateButton: {
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    dateButtonText: {
      fontSize: fontSize.bodyLg,
      fontFamily: typography.body.fontFamily,
      color: colors.textPrimary,
    },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    submitButton: { marginTop: spacing.lg, marginBottom: spacing.xxl },
  });
}

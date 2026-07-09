import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { useToast } from '../../../ui/ToastProvider';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { CATEGORIES, UNITS } from '../constants';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY } from '../hooks/useInventoryItemsQuery';
import { createItem, getItem, listItems, lookupProductByBarcode, updateItem } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import { triggerHaptic } from '../../../services/haptics';
import { makeItemFormSchema, type ItemFormValues } from '../schemas/itemSchema';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

export function ItemFormScreen({ navigation, route }: PantryStackScreenProps<'ItemForm'>) {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const itemId = route.params?.itemId;
  const initialBarcode = route.params?.initialBarcode;
  const initialName = route.params?.initialName;
  const initialCategory = route.params?.initialCategory;
  const initialUnit = route.params?.initialUnit;
  const isEditMode = !!itemId;
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();

  const { data: locations } = useLocationsQuery();
  const { data: existingItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['item', homeId, itemId],
    queryFn: () => getItem(homeId, itemId as string),
    enabled: isEditMode,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDoseTimePicker, setShowDoseTimePicker] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isScanningExpiryDate, setIsScanningExpiryDate] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(makeItemFormSchema(t)),
    defaultValues: {
      name: initialName ?? '',
      locationId: '',
      category: initialCategory,
      quantity: 1,
      unit: initialUnit,
      barcode: initialBarcode,
      doseTimes: [],
    },
  });

  const isMedicine = useWatch({ control, name: 'category' }) === 'Medicine';

  useEffect(() => {
    navigation.setOptions({ title: isEditMode ? t('pantry.itemForm.titleEdit') : t('pantry.itemForm.titleAdd') });
  }, [navigation, isEditMode, t]);

  useEffect(() => {
    if (existingItem) {
      reset({
        name: existingItem.name,
        locationId: existingItem.locationId,
        category: existingItem.category,
        quantity: existingItem.quantity,
        unit: existingItem.unit,
        expiryDate: existingItem.expiryDate ? new Date(existingItem.expiryDate) : undefined,
        barcode: existingItem.barcode ?? undefined,
        doseAmount: existingItem.doseAmount ?? undefined,
        doseTimes: existingItem.doseTimes ?? [],
      });
    }
  }, [existingItem, reset]);

  const applyBarcodeMatch = async (code: string) => {
    const result = await listItems(homeId, { barcode: code, limit: 1 });
    const match = result.items[0];
    if (match) {
      if (!getValues('name')) setValue('name', match.name);
      if (!getValues('category')) setValue('category', match.category);
      if (!getValues('unit')) setValue('unit', match.unit);
      return;
    }

    const product = await lookupProductByBarcode(homeId, code);
    if (product) {
      if (!getValues('name')) setValue('name', product.name);
      if (product.category && !getValues('category')) setValue('category', product.category);
      if (product.unit && !getValues('unit')) setValue('unit', product.unit);
    }
  };

  useEffect(() => {
    // initialName means the caller (e.g. QuickAddItemScreen) already resolved the barcode.
    if (initialBarcode && !isEditMode && !initialName) {
      applyBarcodeMatch(initialBarcode);
    }
    // Only meant to run once on mount with the barcode the screen was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScanBarcode = async () => {
    setIsScanningBarcode(true);
    try {
      const outcome = await scanBarcodeFromCamera();
      if (outcome.status === 'cancelled') return;
      if (outcome.status === 'not-found') {
        showToast({ message: t('pantry.itemForm.barcodeNotFoundMessage'), variant: 'info' });
        return;
      }

      setValue('barcode', outcome.value);

      if (!isEditMode) {
        await applyBarcodeMatch(outcome.value);
      }
    } catch {
      showToast({ message: t('pantry.itemForm.scanErrorMessage'), variant: 'error' });
    } finally {
      setIsScanningBarcode(false);
    }
  };

  const handleScanExpiryDate = async () => {
    setIsScanningExpiryDate(true);
    try {
      const outcome = await scanExpiryDateFromCamera();
      if (outcome.status === 'cancelled') return;
      if (outcome.status === 'not-found') {
        showToast({ message: t('pantry.itemForm.expiryNotFoundMessage'), variant: 'info' });
        return;
      }
      setValue('expiryDate', outcome.date);
    } catch {
      showToast({ message: t('pantry.itemForm.scanErrorMessage'), variant: 'error' });
    } finally {
      setIsScanningExpiryDate(false);
    }
  };

  const onSubmit = async (values: ItemFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        locationId: values.locationId,
        category: values.category,
        quantity: values.quantity,
        unit: values.unit,
        expiryDate: values.expiryDate?.toISOString(),
        barcode: values.barcode,
        doseAmount: values.doseAmount,
        doseTimes: values.doseTimes,
      };

      if (isEditMode) {
        await updateItem(homeId, itemId as string, payload);
      } else {
        await createItem(homeId, payload);
      }

      triggerHaptic('notificationSuccess');
      await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError(t('pantry.itemForm.errorSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingItem) {
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
            label={t('pantry.itemForm.nameLabel')}
            placeholder={t('pantry.itemForm.namePlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Text style={styles.label}>{t('pantry.itemForm.barcodeLabel')}</Text>
      <View style={styles.row}>
        <Controller
          control={control}
          name="barcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.rowInput}>
              <TextField
                label={t('pantry.itemForm.barcodeFieldLabel')}
                hideLabel
                placeholder={t('pantry.itemForm.barcodePlaceholder')}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          )}
        />
        <Button
          testID="scan-barcode-button"
          label={t('pantry.itemForm.scanBarcodeButton')}
          onPress={handleScanBarcode}
          loading={isScanningBarcode}
          variant="outline"
        />
      </View>

      <Text style={styles.label}>{t('pantry.itemForm.locationLabel')}</Text>
      <Controller
        control={control}
        name="locationId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {(locations ?? []).map((location) => (
              <Chip
                key={location.id}
                testID={`location-chip-${location.id}`}
                label={location.name}
                selected={value === location.id}
                onPress={() => onChange(location.id)}
              />
            ))}
          </View>
        )}
      />
      {errors.locationId ? <Text style={styles.error}>{errors.locationId.message}</Text> : null}

      <Text style={styles.label}>{t('pantry.itemForm.categoryLabel')}</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                testID={`category-chip-${category}`}
                label={t(`pantry.categories.${category}`)}
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
        name="quantity"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('pantry.itemForm.quantityLabel')}
            keyboardType="numeric"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
            onBlur={onBlur}
            error={errors.quantity?.message}
          />
        )}
      />

      <Text style={styles.label}>{t('pantry.itemForm.unitLabel')}</Text>
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {UNITS.map((unit) => (
              <Chip
                key={unit}
                testID={`unit-chip-${unit}`}
                label={t(`pantry.units.${unit}`)}
                selected={value === unit}
                onPress={() => onChange(unit)}
              />
            ))}
          </View>
        )}
      />
      {errors.unit ? <Text style={styles.error}>{errors.unit.message}</Text> : null}

      {isMedicine ? (
        <>
          <Controller
            control={control}
            name="doseAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                testID="dose-amount-input"
                label={t('pantry.itemForm.doseAmountLabel')}
                keyboardType="numeric"
                placeholder={t('pantry.itemForm.doseAmountPlaceholder')}
                value={value === undefined ? '' : String(value)}
                onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
                onBlur={onBlur}
              />
            )}
          />

          <Text style={styles.label}>{t('pantry.itemForm.doseTimesLabel')}</Text>
          <Controller
            control={control}
            name="doseTimes"
            render={({ field: { onChange, value } }) => {
              const times = value ?? [];
              return (
                <>
                  <View style={styles.chipsRow}>
                    {times.map((time) => (
                      <Chip
                        key={time}
                        testID={`dose-time-chip-${time}`}
                        label={`${time} ✕`}
                        onPress={() => onChange(times.filter((existingTime) => existingTime !== time))}
                      />
                    ))}
                    <Button
                      testID="add-dose-time-button"
                      label={t('pantry.itemForm.addTimeButton')}
                      onPress={() => setShowDoseTimePicker(true)}
                      variant="outline"
                    />
                  </View>
                  {showDoseTimePicker ? (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      locale={i18n.language}
                      onChange={(_event, selectedTime) => {
                        setShowDoseTimePicker(Platform.OS === 'ios');
                        if (selectedTime) {
                          const formatted = selectedTime.toTimeString().slice(0, 5);
                          if (!times.includes(formatted)) onChange([...times, formatted]);
                        }
                      }}
                    />
                  ) : null}
                </>
              );
            }}
          />
        </>
      ) : null}

      <Text style={styles.label}>{t('pantry.itemForm.expiryDateLabel')}</Text>
      <Controller
        control={control}
        name="expiryDate"
        render={({ field: { onChange, value } }) => (
          <>
            <View style={styles.row}>
              <Pressable
                testID="expiry-date-button"
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {value ? value.toLocaleDateString(i18n.language) : t('pantry.itemForm.selectDateButton')}
                </Text>
              </Pressable>
              <Button
                testID="scan-expiry-date-button"
                label={t('pantry.itemForm.scanExpiryButton')}
                onPress={handleScanExpiryDate}
                loading={isScanningExpiryDate}
                variant="outline"
              />
            </View>
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

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <View style={styles.submitButton}>
        <Button
          testID="item-form-submit"
          label={isEditMode ? t('pantry.itemForm.submitEdit') : t('pantry.itemForm.submitAdd')}
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
    row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' },
    rowInput: { flex: 1 },
    dateButton: {
      flex: 1,
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
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    submitButton: { marginTop: spacing.lg, marginBottom: spacing.xxl },
  });
}

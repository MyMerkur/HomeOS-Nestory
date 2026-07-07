import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { CATEGORIES, CATEGORY_LABELS, UNITS, UNIT_LABELS } from '../constants';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY } from '../hooks/useInventoryItemsQuery';
import { createItem, getItem, listItems, updateItem } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import { itemFormSchema, type ItemFormValues } from '../schemas/itemSchema';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

export function ItemFormScreen({ navigation, route }: PantryStackScreenProps<'ItemForm'>) {
  const itemId = route.params?.itemId;
  const initialBarcode = route.params?.initialBarcode;
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
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: '',
      locationId: '',
      category: undefined,
      quantity: 1,
      unit: undefined,
      barcode: initialBarcode,
      doseTimes: [],
    },
  });

  const isMedicine = useWatch({ control, name: 'category' }) === 'Medicine';

  useEffect(() => {
    navigation.setOptions({ title: isEditMode ? 'Ürünü düzenle' : 'Ürün ekle' });
  }, [navigation, isEditMode]);

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
    }
  };

  useEffect(() => {
    if (initialBarcode && !isEditMode) {
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
        Alert.alert('Barkod bulunamadı', 'Fotoğrafta bir barkod tanınamadı, tekrar dene veya elle gir.');
        return;
      }

      setValue('barcode', outcome.value);

      if (!isEditMode) {
        await applyBarcodeMatch(outcome.value);
      }
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
        Alert.alert('Tarih bulunamadı', 'Fotoğrafta bir SKT tarihi tanınamadı, elle girebilirsin.');
        return;
      }
      setValue('expiryDate', outcome.date);
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

      await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError('Ürün kaydedilemedi, tekrar dene.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Ürün adı"
            placeholder="ör. Süt"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Text style={styles.label}>Barkod (opsiyonel)</Text>
      <View style={styles.row}>
        <Controller
          control={control}
          name="barcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.rowInput}>
              <TextField
                label="Barkod"
                hideLabel
                placeholder="Barkod numarası"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          )}
        />
        <Button
          testID="scan-barcode-button"
          label="Barkod Tara"
          onPress={handleScanBarcode}
          loading={isScanningBarcode}
          variant="outline"
        />
      </View>

      <Text style={styles.label}>Lokasyon</Text>
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

      <Text style={styles.label}>Kategori</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                testID={`category-chip-${category}`}
                label={CATEGORY_LABELS[category]}
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
            label="Miktar"
            keyboardType="numeric"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
            onBlur={onBlur}
            error={errors.quantity?.message}
          />
        )}
      />

      <Text style={styles.label}>Birim</Text>
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {UNITS.map((unit) => (
              <Chip
                key={unit}
                testID={`unit-chip-${unit}`}
                label={UNIT_LABELS[unit]}
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
                label="Doz miktarı (opsiyonel)"
                keyboardType="numeric"
                placeholder="ör. 1"
                value={value === undefined ? '' : String(value)}
                onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
                onBlur={onBlur}
              />
            )}
          />

          <Text style={styles.label}>Doz saatleri (opsiyonel)</Text>
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
                        onPress={() => onChange(times.filter((t) => t !== time))}
                      />
                    ))}
                    <Button
                      testID="add-dose-time-button"
                      label="+ Saat Ekle"
                      onPress={() => setShowDoseTimePicker(true)}
                      variant="outline"
                    />
                  </View>
                  {showDoseTimePicker ? (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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

      <Text style={styles.label}>Son kullanma tarihi (opsiyonel)</Text>
      <View style={styles.row}>
        <Controller
          control={control}
          name="expiryDate"
          render={({ field: { onChange, value } }) => (
            <>
              <Pressable
                testID="expiry-date-button"
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}
                </Text>
              </Pressable>
              {showDatePicker ? (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              ) : null}
            </>
          )}
        />
        <Button
          testID="scan-expiry-date-button"
          label="SKT Tara"
          onPress={handleScanExpiryDate}
          loading={isScanningExpiryDate}
          variant="outline"
        />
      </View>

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <View style={styles.submitButton}>
        <Button
          testID="item-form-submit"
          label={isEditMode ? 'Güncelle' : 'Ekle'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

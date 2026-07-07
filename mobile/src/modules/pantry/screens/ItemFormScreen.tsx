import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
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
    },
  });

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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Ürün adı</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="ör. Süt"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Barkod (opsiyonel)</Text>
      <View style={styles.barcodeRow}>
        <Controller
          control={control}
          name="barcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              placeholder="Barkod numarası"
              value={value ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Pressable
          testID="scan-barcode-button"
          style={[styles.scanButton, isScanningBarcode && styles.buttonDisabled]}
          onPress={handleScanBarcode}
          disabled={isScanningBarcode}
        >
          {isScanningBarcode ? (
            <ActivityIndicator color="#1d76db" />
          ) : (
            <Text style={styles.scanButtonText}>Barkod Tara</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.label}>Lokasyon</Text>
      <Controller
        control={control}
        name="locationId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {(locations ?? []).map((location) => (
              <Pressable
                key={location.id}
                testID={`location-chip-${location.id}`}
                style={[styles.chip, value === location.id && styles.chipActive]}
                onPress={() => onChange(location.id)}
              >
                <Text style={[styles.chipText, value === location.id && styles.chipTextActive]}>
                  {location.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.locationId && <Text style={styles.error}>{errors.locationId.message}</Text>}

      <Text style={styles.label}>Kategori</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                testID={`category-chip-${category}`}
                style={[styles.chip, value === category && styles.chipActive]}
                onPress={() => onChange(category)}
              >
                <Text style={[styles.chipText, value === category && styles.chipTextActive]}>
                  {CATEGORY_LABELS[category]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

      <Text style={styles.label}>Miktar</Text>
      <Controller
        control={control}
        name="quantity"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
            onBlur={onBlur}
          />
        )}
      />
      {errors.quantity && <Text style={styles.error}>{errors.quantity.message}</Text>}

      <Text style={styles.label}>Birim</Text>
      <Controller
        control={control}
        name="unit"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {UNITS.map((unit) => (
              <Pressable
                key={unit}
                testID={`unit-chip-${unit}`}
                style={[styles.chip, value === unit && styles.chipActive]}
                onPress={() => onChange(unit)}
              >
                <Text style={[styles.chipText, value === unit && styles.chipTextActive]}>
                  {UNIT_LABELS[unit]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.unit && <Text style={styles.error}>{errors.unit.message}</Text>}

      <Text style={styles.label}>Son kullanma tarihi (opsiyonel)</Text>
      <View style={styles.barcodeRow}>
        <Controller
          control={control}
          name="expiryDate"
          render={({ field: { onChange, value } }) => (
            <>
              <Pressable
                testID="expiry-date-button"
                style={[styles.input, styles.barcodeInput]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={value ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              )}
            </>
          )}
        />
        <Pressable
          testID="scan-expiry-date-button"
          style={[styles.scanButton, isScanningExpiryDate && styles.buttonDisabled]}
          onPress={handleScanExpiryDate}
          disabled={isScanningExpiryDate}
        >
          {isScanningExpiryDate ? (
            <ActivityIndicator color="#1d76db" />
          ) : (
            <Text style={styles.scanButtonText}>SKT Tara</Text>
          )}
        </Pressable>
      </View>

      {serverError && <Text style={styles.error}>{serverError}</Text>}

      <Pressable
        testID="item-form-submit"
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isEditMode ? 'Güncelle' : 'Ekle'}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  error: { color: '#c0392b', fontSize: 13 },
  barcodeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  barcodeInput: { flex: 1 },
  scanButton: {
    borderWidth: 1,
    borderColor: '#1d76db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scanButtonText: { color: '#1d76db', fontWeight: '600', fontSize: 13 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0' },
  chipActive: { backgroundColor: '#1d76db' },
  chipText: { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});

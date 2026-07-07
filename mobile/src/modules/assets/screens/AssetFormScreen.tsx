import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { ASSET_CATEGORIES, ASSET_CATEGORY_LABELS } from '../constants';
import { ASSETS_QUERY_KEY } from '../hooks/useAssetsQuery';
import { createAsset, getAsset, updateAsset } from '../services/assetApi';
import { assetFormSchema, type AssetFormValues } from '../schemas/assetSchema';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

export function AssetFormScreen({ navigation, route }: DashboardStackScreenProps<'AssetForm'>) {
  const assetId = route.params?.assetId;
  const isEditMode = !!assetId;
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();

  const { data: existingAsset, isLoading: isLoadingAsset } = useQuery({
    queryKey: ['asset', homeId, assetId],
    queryFn: () => getAsset(homeId, assetId as string),
    enabled: isEditMode,
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showWarrantyDatePicker, setShowWarrantyDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: { name: '', category: undefined },
  });

  useEffect(() => {
    navigation.setOptions({ title: isEditMode ? 'Eşyayı düzenle' : 'Eşya ekle' });
  }, [navigation, isEditMode]);

  useEffect(() => {
    if (existingAsset) {
      reset({
        name: existingAsset.name,
        category: existingAsset.category,
        room: existingAsset.room ?? undefined,
        brand: existingAsset.brand ?? undefined,
        serialNumber: existingAsset.serialNumber ?? undefined,
        purchaseDate: existingAsset.purchaseDate ? new Date(existingAsset.purchaseDate) : undefined,
        price: existingAsset.price ?? undefined,
        warrantyEndDate: existingAsset.warrantyEndDate ? new Date(existingAsset.warrantyEndDate) : undefined,
        notes: existingAsset.notes ?? undefined,
      });
    }
  }, [existingAsset, reset]);

  const onSubmit = async (values: AssetFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        category: values.category,
        room: values.room,
        brand: values.brand,
        serialNumber: values.serialNumber,
        purchaseDate: values.purchaseDate?.toISOString(),
        price: values.price,
        warrantyEndDate: values.warrantyEndDate?.toISOString(),
        notes: values.notes,
      };

      if (isEditMode) {
        await updateAsset(homeId, assetId as string, payload);
      } else {
        await createAsset(homeId, payload);
      }

      await queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError('Eşya kaydedilemedi, tekrar dene.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingAsset) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Eşya adı</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="ör. Televizyon"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Kategori</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {ASSET_CATEGORIES.map((category) => (
              <Pressable
                key={category}
                testID={`asset-category-chip-${category}`}
                style={[styles.chip, value === category && styles.chipActive]}
                onPress={() => onChange(category)}
              >
                <Text style={[styles.chipText, value === category && styles.chipTextActive]}>
                  {ASSET_CATEGORY_LABELS[category]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

      <Text style={styles.label}>Oda (opsiyonel)</Text>
      <Controller
        control={control}
        name="room"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="ör. Oturma Odası"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Text style={styles.label}>Marka (opsiyonel)</Text>
      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Text style={styles.label}>Seri numarası (opsiyonel)</Text>
      <Controller
        control={control}
        name="serialNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Text style={styles.label}>Fiyat (opsiyonel)</Text>
      <Controller
        control={control}
        name="price"
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

      <Text style={styles.label}>Satın alma tarihi (opsiyonel)</Text>
      <Controller
        control={control}
        name="purchaseDate"
        render={({ field: { onChange, value } }) => (
          <>
            <Pressable
              testID="purchase-date-button"
              style={styles.input}
              onPress={() => setShowPurchaseDatePicker(true)}
            >
              <Text>{value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}</Text>
            </Pressable>
            {showPurchaseDatePicker && (
              <DateTimePicker
                value={value ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event, selectedDate) => {
                  setShowPurchaseDatePicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            )}
          </>
        )}
      />

      <Text style={styles.label}>Garanti bitiş tarihi (opsiyonel)</Text>
      <Controller
        control={control}
        name="warrantyEndDate"
        render={({ field: { onChange, value } }) => (
          <>
            <Pressable
              testID="warranty-end-date-button"
              style={styles.input}
              onPress={() => setShowWarrantyDatePicker(true)}
            >
              <Text>{value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}</Text>
            </Pressable>
            {showWarrantyDatePicker && (
              <DateTimePicker
                value={value ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event, selectedDate) => {
                  setShowWarrantyDatePicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            )}
          </>
        )}
      />

      <Text style={styles.label}>Notlar (opsiyonel)</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {serverError && <Text style={styles.error}>{serverError}</Text>}

      <Pressable
        testID="asset-form-submit"
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

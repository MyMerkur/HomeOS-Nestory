import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { captureImage } from '../../../services/cameraCapture';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { parseExpiryDateFromText } from '../../pantry/services/dateOcrScanner';
import { ASSET_CATEGORIES, ASSET_CATEGORY_LABELS } from '../constants';
import { ASSETS_QUERY_KEY } from '../hooks/useAssetsQuery';
import {
  createAsset,
  getAsset,
  updateAsset,
  uploadReceipt,
  uploadWarrantyDocument,
} from '../services/assetApi';
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
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [isAddingWarrantyDocument, setIsAddingWarrantyDocument] = useState(false);
  const [pendingReceiptUri, setPendingReceiptUri] = useState<string | null>(null);
  const [pendingWarrantyDocumentUri, setPendingWarrantyDocumentUri] = useState<string | null>(null);
  const [receiptJustUploaded, setReceiptJustUploaded] = useState(false);
  const [warrantyDocumentJustUploaded, setWarrantyDocumentJustUploaded] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: { name: '', category: undefined },
  });

  const hasReceipt = !!existingAsset?.receiptImageUrl || !!pendingReceiptUri || receiptJustUploaded;
  const hasWarrantyDocument =
    !!existingAsset?.warrantyDocumentUrl || !!pendingWarrantyDocumentUri || warrantyDocumentJustUploaded;

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

  const handleScanReceipt = async () => {
    setIsScanningReceipt(true);
    try {
      const uri = await captureImage();
      if (!uri) return;

      const result = await TextRecognition.recognize(uri);
      const date = parseExpiryDateFromText(result.text);
      if (date) setValue('purchaseDate', date);

      if (isEditMode) {
        await uploadReceipt(homeId, assetId as string, uri);
        setReceiptJustUploaded(true);
        await queryClient.invalidateQueries({ queryKey: ['asset', homeId, assetId] });
      } else {
        setPendingReceiptUri(uri);
      }
    } finally {
      setIsScanningReceipt(false);
    }
  };

  const handleAddWarrantyDocument = async () => {
    setIsAddingWarrantyDocument(true);
    try {
      const uri = await captureImage();
      if (!uri) return;

      if (isEditMode) {
        await uploadWarrantyDocument(homeId, assetId as string, uri);
        setWarrantyDocumentJustUploaded(true);
        await queryClient.invalidateQueries({ queryKey: ['asset', homeId, assetId] });
      } else {
        setPendingWarrantyDocumentUri(uri);
      }
    } finally {
      setIsAddingWarrantyDocument(false);
    }
  };

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
        const created = await createAsset(homeId, payload);
        if (pendingReceiptUri) await uploadReceipt(homeId, created.id, pendingReceiptUri);
        if (pendingWarrantyDocumentUri) {
          await uploadWarrantyDocument(homeId, created.id, pendingWarrantyDocumentUri);
        }
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
            label="Eşya adı"
            placeholder="ör. Televizyon"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Text style={styles.label}>Kategori</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipsRow}>
            {ASSET_CATEGORIES.map((category) => (
              <Chip
                key={category}
                testID={`asset-category-chip-${category}`}
                label={ASSET_CATEGORY_LABELS[category]}
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
        name="room"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Oda (opsiyonel)"
            placeholder="ör. Oturma Odası"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField label="Marka (opsiyonel)" value={value ?? ''} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      <Controller
        control={control}
        name="serialNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Seri numarası (opsiyonel)"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Fiyat (opsiyonel)"
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
              style={styles.dateButton}
              onPress={() => setShowPurchaseDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}
              </Text>
            </Pressable>
            {showPurchaseDatePicker ? (
              <DateTimePicker
                value={value ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event, selectedDate) => {
                  setShowPurchaseDatePicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            ) : null}
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
              style={styles.dateButton}
              onPress={() => setShowWarrantyDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {value ? value.toLocaleDateString('tr-TR') : 'Tarih seç'}
              </Text>
            </Pressable>
            {showWarrantyDatePicker ? (
              <DateTimePicker
                value={value ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event, selectedDate) => {
                  setShowWarrantyDatePicker(Platform.OS === 'ios');
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            ) : null}
          </>
        )}
      />

      <Text style={styles.label}>Fiş / Garanti Belgesi (opsiyonel)</Text>
      <View style={styles.chipsRow}>
        <Button
          testID="scan-receipt-button"
          label={hasReceipt ? 'Fiş Eklendi ✓' : 'Fişi Tara'}
          onPress={handleScanReceipt}
          loading={isScanningReceipt}
          variant="outline"
        />
        <Button
          testID="add-warranty-document-button"
          label={hasWarrantyDocument ? 'Belge Eklendi ✓' : 'Garanti Belgesi Ekle'}
          onPress={handleAddWarrantyDocument}
          loading={isAddingWarrantyDocument}
          variant="outline"
        />
      </View>

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Notlar (opsiyonel)"
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
          testID="asset-form-submit"
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
  submitButton: { marginTop: spacing.lg, marginBottom: spacing.xxl },
});

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { CATEGORY_LABELS, UNIT_LABELS } from '../constants';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY } from '../hooks/useInventoryItemsQuery';
import { createItem, listItems, type InventoryItem } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

export function QuickAddItemScreen({ navigation }: PantryStackScreenProps<'QuickAddItem'>) {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data: locations } = useLocationsQuery();

  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isScanningExpiryDate, setIsScanningExpiryDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [barcode, setBarcode] = useState<string | null>(null);
  const [matchedItem, setMatchedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [locationId, setLocationId] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const handleScanBarcode = async () => {
    setIsScanningBarcode(true);
    try {
      const outcome = await scanBarcodeFromCamera();
      if (outcome.status === 'cancelled') return;
      if (outcome.status === 'not-found') {
        Alert.alert('Barkod bulunamadı', 'Fotoğrafta bir barkod tanınamadı, tekrar dene.');
        return;
      }

      const result = await listItems(homeId, { barcode: outcome.value, limit: 1 });
      const match = result.items[0];
      setBarcode(outcome.value);

      if (match) {
        setMatchedItem(match);
        setQuantity(String(match.quantity));
        setLocationId(match.locationId);
      } else {
        Alert.alert(
          'Bu barkod yeni',
          'Daha önce bu barkodla eklenmiş ürün yok. Tüm bilgileriyle eklemek için forma geçebilirsin.',
          [
            { text: 'Vazgeç', style: 'cancel' },
            {
              text: 'Forma Git',
              onPress: () => navigation.replace('ItemForm', { initialBarcode: outcome.value }),
            },
          ],
        );
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
      setExpiryDate(outcome.date);
    } finally {
      setIsScanningExpiryDate(false);
    }
  };

  const handleSubmit = async () => {
    if (!matchedItem || !locationId) return;
    const parsedQuantity = Number(quantity);
    if (!parsedQuantity || parsedQuantity <= 0) {
      setServerError('Miktar 0’dan büyük olmalı');
      return;
    }

    setServerError(null);
    setIsSubmitting(true);
    try {
      await createItem(homeId, {
        name: matchedItem.name,
        category: matchedItem.category,
        unit: matchedItem.unit,
        quantity: parsedQuantity,
        locationId,
        expiryDate: expiryDate?.toISOString(),
        barcode: barcode ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError('Ürün kaydedilemedi, tekrar dene.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="quick-add-scan-barcode-button"
        label="Barkodu Tara"
        onPress={handleScanBarcode}
        loading={isScanningBarcode}
        variant="outline"
      />

      {matchedItem ? (
        <Card style={styles.matchCard}>
          <Text style={styles.matchName}>{matchedItem.name}</Text>
          <Text style={styles.matchMeta}>
            {CATEGORY_LABELS[matchedItem.category]} · {UNIT_LABELS[matchedItem.unit]}
          </Text>

          <TextField
            testID="quick-add-quantity"
            label="Miktar"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Lokasyon</Text>
          <View style={styles.chipsRow}>
            {(locations ?? []).map((location) => (
              <Chip
                key={location.id}
                testID={`quick-add-location-chip-${location.id}`}
                label={location.name}
                selected={locationId === location.id}
                onPress={() => setLocationId(location.id)}
              />
            ))}
          </View>

          <Text style={styles.label}>Son kullanma tarihi (opsiyonel)</Text>
          <View style={styles.row}>
            <View style={styles.expiryDisplay}>
              <Text style={styles.expiryDisplayText}>
                {expiryDate ? expiryDate.toLocaleDateString('tr-TR') : 'Taranmadı'}
              </Text>
            </View>
            <Button
              testID="quick-add-scan-expiry-date-button"
              label="SKT Tara"
              onPress={handleScanExpiryDate}
              loading={isScanningExpiryDate}
              variant="outline"
            />
          </View>

          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

          <Button
            testID="quick-add-submit"
            label="Hızlı Ekle"
            onPress={handleSubmit}
            loading={isSubmitting}
          />
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background },
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
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  expiryDisplay: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  expiryDisplayText: {
    fontSize: fontSize.bodyLg,
    fontFamily: typography.body.fontFamily,
    color: colors.textPrimary,
  },
  matchCard: { marginTop: spacing.xl, gap: spacing.md },
  matchName: {
    fontSize: fontSize.displayMd,
    fontFamily: typography.display.fontFamily,
    fontWeight: typography.display.fontWeight,
    color: colors.textPrimary,
  },
  matchMeta: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

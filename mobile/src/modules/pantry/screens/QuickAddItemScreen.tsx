import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
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
      <Pressable
        testID="quick-add-scan-barcode-button"
        style={[styles.scanButton, isScanningBarcode && styles.buttonDisabled]}
        onPress={handleScanBarcode}
        disabled={isScanningBarcode}
      >
        {isScanningBarcode ? (
          <ActivityIndicator color="#1d76db" />
        ) : (
          <Text style={styles.scanButtonText}>Barkodu Tara</Text>
        )}
      </Pressable>

      {matchedItem && (
        <View style={styles.matchCard}>
          <Text style={styles.matchName}>{matchedItem.name}</Text>
          <Text style={styles.matchMeta}>
            {CATEGORY_LABELS[matchedItem.category]} · {UNIT_LABELS[matchedItem.unit]}
          </Text>

          <Text style={styles.label}>Miktar</Text>
          <TextInput
            testID="quick-add-quantity"
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Lokasyon</Text>
          <View style={styles.chipsRow}>
            {(locations ?? []).map((location) => (
              <Pressable
                key={location.id}
                testID={`quick-add-location-chip-${location.id}`}
                style={[styles.chip, locationId === location.id && styles.chipActive]}
                onPress={() => setLocationId(location.id)}
              >
                <Text style={[styles.chipText, locationId === location.id && styles.chipTextActive]}>
                  {location.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Son kullanma tarihi (opsiyonel)</Text>
          <View style={styles.barcodeRow}>
            <View style={[styles.input, styles.barcodeInput]}>
              <Text>{expiryDate ? expiryDate.toLocaleDateString('tr-TR') : 'Taranmadı'}</Text>
            </View>
            <Pressable
              testID="quick-add-scan-expiry-date-button"
              style={[styles.scanButtonSmall, isScanningExpiryDate && styles.buttonDisabled]}
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
            testID="quick-add-submit"
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hızlı Ekle</Text>}
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  error: { color: '#c0392b', fontSize: 13, marginTop: 8 },
  barcodeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  barcodeInput: { flex: 1 },
  scanButton: {
    borderWidth: 1,
    borderColor: '#1d76db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  scanButtonSmall: {
    borderWidth: 1,
    borderColor: '#1d76db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scanButtonText: { color: '#1d76db', fontWeight: '600', fontSize: 13 },
  matchCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f6f8fa',
  },
  matchName: { fontSize: 18, fontWeight: '700', color: '#222' },
  matchMeta: { fontSize: 13, color: '#666', marginTop: 2 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e8e8e8' },
  chipActive: { backgroundColor: '#1d76db' },
  chipText: { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});

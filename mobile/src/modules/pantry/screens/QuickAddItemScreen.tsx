import { useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { useToast } from '../../../ui/ToastProvider';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY } from '../hooks/useInventoryItemsQuery';
import { createItem, listItems, lookupProductByBarcode, type InventoryItem } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import { triggerHaptic } from '../../../services/haptics';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

export function QuickAddItemScreen({ navigation }: PantryStackScreenProps<'QuickAddItem'>) {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data: locations } = useLocationsQuery();

  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isScanningExpiryDate, setIsScanningExpiryDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        showToast({ message: t('pantry.quickAdd.barcodeNotFoundMessage'), variant: 'info' });
        return;
      }

      const result = await listItems(homeId, { barcode: outcome.value, limit: 1 });
      const match = result.items[0];
      setBarcode(outcome.value);

      if (match) {
        setMatchedItem(match);
        setQuantity(String(match.quantity));
        setLocationId(match.locationId);
        return;
      }

      const product = await lookupProductByBarcode(homeId, outcome.value);
      if (product) {
        navigation.replace('ItemForm', {
          initialBarcode: outcome.value,
          initialName: product.name,
          initialCategory: product.category ?? undefined,
        });
        return;
      }

      Alert.alert(
        t('pantry.quickAdd.newBarcodeTitle'),
        t('pantry.quickAdd.newBarcodeMessage'),
        [
          { text: t('pantry.quickAdd.cancelButton'), style: 'cancel' },
          {
            text: t('pantry.quickAdd.goToFormButton'),
            onPress: () => navigation.replace('ItemForm', { initialBarcode: outcome.value }),
          },
        ],
      );
    } catch {
      showToast({ message: t('pantry.quickAdd.scanErrorMessage'), variant: 'error' });
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
        showToast({ message: t('pantry.quickAdd.expiryNotFoundMessage'), variant: 'info' });
        return;
      }
      setExpiryDate(outcome.date);
    } catch {
      showToast({ message: t('pantry.quickAdd.scanErrorMessage'), variant: 'error' });
    } finally {
      setIsScanningExpiryDate(false);
    }
  };

  const handleSubmit = async () => {
    if (!matchedItem || !locationId) return;
    const parsedQuantity = Number(quantity);
    if (!parsedQuantity || parsedQuantity <= 0) {
      setServerError(t('pantry.quickAdd.errorQuantity'));
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
      triggerHaptic('notificationSuccess');
      await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
      navigation.goBack();
    } catch {
      setServerError(t('pantry.quickAdd.errorSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="quick-add-scan-barcode-button"
        label={t('pantry.quickAdd.scanBarcodeButton')}
        onPress={handleScanBarcode}
        loading={isScanningBarcode}
        variant="outline"
      />

      {matchedItem ? (
        <Card style={styles.matchCard}>
          <Text style={styles.matchName}>{matchedItem.name}</Text>
          <Text style={styles.matchMeta}>
            {t(`pantry.categories.${matchedItem.category}`)} · {t(`pantry.units.${matchedItem.unit}`)}
          </Text>

          <TextField
            testID="quick-add-quantity"
            label={t('pantry.quickAdd.quantityLabel')}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>{t('pantry.quickAdd.locationLabel')}</Text>
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

          <Text style={styles.label}>{t('pantry.quickAdd.expiryDateLabel')}</Text>
          <View style={styles.row}>
            <Pressable
              testID="quick-add-expiry-date-button"
              style={styles.expiryDisplay}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.expiryDisplayText}>
                {expiryDate ? expiryDate.toLocaleDateString(i18n.language) : t('pantry.quickAdd.notScannedLabel')}
              </Text>
            </Pressable>
            <Button
              testID="quick-add-scan-expiry-date-button"
              label={t('pantry.quickAdd.scanExpiryButton')}
              onPress={handleScanExpiryDate}
              loading={isScanningExpiryDate}
              variant="outline"
            />
          </View>
          {showDatePicker ? (
            <DateTimePicker
              value={expiryDate ?? new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setExpiryDate(selectedDate);
              }}
            />
          ) : null}

          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

          <Button
            testID="quick-add-submit"
            label={t('pantry.quickAdd.submitButton')}
            onPress={handleSubmit}
            loading={isSubmitting}
          />
        </Card>
      ) : null}
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}

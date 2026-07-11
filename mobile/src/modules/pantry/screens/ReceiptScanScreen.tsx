import TextRecognition from '@react-native-ml-kit/text-recognition';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconCheck } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { useToast } from '../../../ui/ToastProvider';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { captureImage } from '../../../services/cameraCapture';
import { triggerHaptic } from '../../../services/haptics';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY } from '../hooks/useInventoryItemsQuery';
import { createItem } from '../services/pantryApi';
import { parseReceiptLines } from '../services/receiptParser';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

type ReceiptItemDraft = { id: string; name: string; price?: number; included: boolean };

export function ReceiptScanScreen({ navigation }: PantryStackScreenProps<'ReceiptScan'>) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data: locations } = useLocationsQuery();

  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drafts, setDrafts] = useState<ReceiptItemDraft[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);

  const includedCount = drafts.filter((draft) => draft.included).length;
  const canSubmit = includedCount > 0 && locationId !== null && !isSubmitting;

  const handleScanReceipt = async () => {
    setIsScanning(true);
    try {
      const uri = await captureImage();
      if (!uri) return;

      const result = await TextRecognition.recognize(uri);
      const lines = parseReceiptLines(result.text);

      if (lines.length === 0) {
        showToast({ message: t('pantry.receiptScan.noItemsFoundMessage'), variant: 'info' });
        return;
      }

      setDrafts(
        lines.map((line, index) => ({ id: String(index), name: line.name, price: line.price, included: true })),
      );
    } catch {
      showToast({ message: t('pantry.receiptScan.scanErrorMessage'), variant: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  const toggleIncluded = (id: string) => {
    setDrafts((current) =>
      current.map((draft) => (draft.id === id ? { ...draft, included: !draft.included } : draft)),
    );
  };

  const updateName = (id: string, name: string) => {
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, name } : draft)));
  };

  const updatePrice = (id: string, text: string) => {
    const price = text === '' ? undefined : Number(text);
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, price } : draft)));
  };

  const handleSubmit = async () => {
    if (!locationId) return;
    const toCreate = drafts.filter((draft) => draft.included && draft.name.trim().length > 0);
    if (toCreate.length === 0) return;

    setIsSubmitting(true);
    const results = await Promise.allSettled(
      toCreate.map((draft) =>
        createItem(homeId, {
          name: draft.name.trim(),
          locationId,
          category: 'Other',
          unit: 'piece',
          quantity: 1,
          price: draft.price,
        }),
      ),
    );
    setIsSubmitting(false);

    const successCount = results.filter((result) => result.status === 'fulfilled').length;
    if (successCount === 0) {
      showToast({ message: t('pantry.receiptScan.errorSaveAll'), variant: 'error' });
      return;
    }

    triggerHaptic('notificationSuccess');
    await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
    showToast({
      message: t('pantry.receiptScan.successMessage', { count: successCount }),
      variant: 'success',
    });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="receipt-scan-capture-button"
        label={t('pantry.receiptScan.captureButton')}
        onPress={handleScanReceipt}
        loading={isScanning}
        variant="outline"
      />

      {drafts.length > 0 ? (
        <>
          <Text style={styles.label}>{t('pantry.receiptScan.locationLabel')}</Text>
          <View style={styles.chipsRow}>
            {(locations ?? []).map((location) => (
              <Chip
                key={location.id}
                testID={`receipt-scan-location-chip-${location.id}`}
                label={location.name}
                selected={locationId === location.id}
                onPress={() => setLocationId(location.id)}
              />
            ))}
          </View>

          <Text style={styles.label}>
            {t('pantry.receiptScan.itemsLabel', { count: drafts.length })}
          </Text>
          {drafts.map((draft) => (
            <Card key={draft.id} testID={`receipt-scan-item-${draft.id}`} style={styles.itemCard}>
              <Pressable
                testID={`receipt-scan-item-toggle-${draft.id}`}
                style={[styles.checkbox, draft.included && styles.checkboxChecked]}
                onPress={() => toggleIncluded(draft.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: draft.included }}
              >
                {draft.included ? <IconCheck color={colors.surface} size={16} /> : null}
              </Pressable>
              <View style={styles.itemFields}>
                <View style={styles.itemNameField}>
                  <TextField
                    testID={`receipt-scan-item-name-${draft.id}`}
                    label={t('pantry.receiptScan.itemNameA11y')}
                    hideLabel
                    value={draft.name}
                    onChangeText={(name) => updateName(draft.id, name)}
                    editable={draft.included}
                  />
                </View>
                <View style={styles.itemPriceField}>
                  <TextField
                    testID={`receipt-scan-item-price-${draft.id}`}
                    label={t('pantry.receiptScan.itemPriceA11y')}
                    hideLabel
                    placeholder={t('pantry.itemForm.pricePlaceholder')}
                    keyboardType="numeric"
                    value={draft.price === undefined ? '' : String(draft.price)}
                    onChangeText={(text) => updatePrice(draft.id, text)}
                    editable={draft.included}
                  />
                </View>
              </View>
            </Card>
          ))}

          <Button
            testID="receipt-scan-submit"
            label={t('pantry.receiptScan.submitButton', { count: includedCount })}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!canSubmit}
          />
        </>
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
      marginTop: spacing.sm,
    },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    itemCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    itemFields: { flex: 1, flexDirection: 'row', gap: spacing.sm },
    itemNameField: { flex: 2 },
    itemPriceField: { flex: 1 },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  });
}

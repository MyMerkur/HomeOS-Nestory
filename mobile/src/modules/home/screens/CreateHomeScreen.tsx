import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { IconConfetti } from '@tabler/icons-react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useHomeStore } from '../../../store/useHomeStore';
import { createHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { createHomeSchema, type CreateHomeFormValues } from '../schemas/homeSchema';

export function CreateHomeScreen() {
  const queryClient = useQueryClient();
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<{ home: HomeSummary; inviteCode: string } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHomeFormValues>({
    resolver: zodResolver(createHomeSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: CreateHomeFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await createHomeRequest(values);
      setCreated(result);
    } catch {
      setServerError('Ev oluşturulamadı, tekrar dene.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!created) return;
    queryClient.setQueryData<HomeSummary[]>(HOMES_QUERY_KEY, (existing) => [
      ...(existing ?? []),
      created.home,
    ]);
    setSelectedHomeId(created.home.id);
  };

  if (created) {
    return (
      <View style={styles.container}>
        <IconConfetti color={colors.primary} size={40} style={styles.centeredIcon} />
        <Text style={styles.title}>Ev oluşturuldu</Text>
        <Text style={styles.subtitle}>
          Aile üyelerini davet etmek için bu kodu paylaş. Bu kod yalnızca burada gösterilir.
        </Text>
        <Text testID="invite-code" style={styles.inviteCode} selectable>
          {created.inviteCode}
        </Text>
        <Button testID="continue-button" label="Devam et" onPress={handleContinue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ev oluştur</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Ev adı (ör. Ev, Yazlık)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />
        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

        <Button
          testID="create-home-submit"
          label="Oluştur"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  centeredIcon: { alignSelf: 'center', marginBottom: spacing.sm },
  title: {
    fontSize: fontSize.displayLg,
    fontFamily: typography.display.fontFamily,
    fontWeight: typography.display.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  form: { gap: spacing.md, marginTop: spacing.xxl },
  error: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.dangerDark,
  },
  inviteCode: {
    fontSize: fontSize.displayLg * 1.4,
    fontFamily: typography.display.fontFamily,
    fontWeight: typography.display.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
    marginVertical: spacing.xl,
  },
});

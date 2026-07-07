import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useHomeStore } from '../../../store/useHomeStore';
import { joinHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { joinHomeSchema, type JoinHomeFormValues } from '../schemas/homeSchema';

export function JoinHomeScreen() {
  const queryClient = useQueryClient();
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinHomeFormValues>({
    resolver: zodResolver(joinHomeSchema),
    defaultValues: { inviteCode: '' },
  });

  const onSubmit = async (values: JoinHomeFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const home = await joinHomeRequest(values);
      queryClient.setQueryData<HomeSummary[]>(HOMES_QUERY_KEY, (existing) => [
        ...(existing ?? []),
        home,
      ]);
      setSelectedHomeId(home.id);
    } catch {
      setServerError('Davet kodu geçersiz ya da bu eve zaten üyesin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Davet koduyla katıl</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="inviteCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Davet kodu"
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.inviteCode?.message}
              style={styles.codeInput}
            />
          )}
        />
        {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

        <Button
          testID="join-home-submit"
          label="Katıl"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
  title: {
    fontSize: fontSize.displayLg,
    fontFamily: typography.display.fontFamily,
    fontWeight: typography.display.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  form: { gap: spacing.md },
  codeInput: {
    fontSize: fontSize.displayMd,
    letterSpacing: 4,
    textAlign: 'center',
  },
  error: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.dangerDark,
  },
});

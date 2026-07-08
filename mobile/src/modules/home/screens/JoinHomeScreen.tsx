import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useHomeStore } from '../../../store/useHomeStore';
import { joinHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { makeJoinHomeSchema, type JoinHomeFormValues } from '../schemas/homeSchema';

export function JoinHomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const queryClient = useQueryClient();
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinHomeFormValues>({
    resolver: zodResolver(makeJoinHomeSchema(t)),
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
      setServerError(t('onboarding.joinHome.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.joinHome.title')}</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="inviteCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('onboarding.joinHome.codeLabel')}
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
          label={t('onboarding.joinHome.submitButton')}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}

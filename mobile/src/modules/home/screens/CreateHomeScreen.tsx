import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { IconConfetti } from '@tabler/icons-react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useHomeStore } from '../../../store/useHomeStore';
import { createHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { makeCreateHomeSchema, type CreateHomeFormValues } from '../schemas/homeSchema';

export function CreateHomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
    resolver: zodResolver(makeCreateHomeSchema(t)),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: CreateHomeFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await createHomeRequest(values);
      setCreated(result);
    } catch {
      setServerError(t('onboarding.createHome.errorGeneric'));
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
        <Text style={styles.title}>{t('onboarding.createHome.createdTitle')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.createHome.createdSubtitle')}</Text>
        <Text testID="invite-code" style={styles.inviteCode} selectable>
          {created.inviteCode}
        </Text>
        <Button testID="continue-button" label={t('onboarding.createHome.continueButton')} onPress={handleContinue} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>{t('onboarding.createHome.title')}</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('onboarding.createHome.nameLabel')}
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
          label={t('onboarding.createHome.submitButton')}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}

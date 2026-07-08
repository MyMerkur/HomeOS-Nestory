import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useAuthStore } from '../../../store/useAuthStore';
import { loginRequest } from '../services/authApi';
import { makeLoginSchema, type LoginFormValues } from '../schemas/authSchema';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(makeLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const session = await loginRequest(values);
      await setSession(session);
    } catch {
      setServerError(t('auth.login.errorInvalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.wordmark}>{t('auth.login.wordmark')}</Text>
        <Text style={styles.tagline}>{t('auth.login.tagline')}</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('auth.login.emailLabel')}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('auth.login.passwordLabel')}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

          <Button
            testID="login-submit-button"
            label={t('auth.login.submitButton')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </View>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>{t('auth.login.noAccountLink')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
    wordmark: {
      fontSize: fontSize.displayLg,
      fontFamily: typography.display.fontFamily,
      fontWeight: typography.display.fontWeight,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    tagline: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.xxl,
    },
    form: { gap: spacing.md },
    error: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.dangerDark,
    },
    link: {
      textAlign: 'center',
      marginTop: spacing.xl,
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      color: colors.primary,
    },
  });
}

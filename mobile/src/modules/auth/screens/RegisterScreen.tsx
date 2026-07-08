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
import { registerRequest } from '../services/authApi';
import { makeRegisterSchema, type RegisterFormValues } from '../schemas/authSchema';
import { getErrorMessage } from '../../../services/apiError';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

export function RegisterScreen({ navigation }: AuthStackScreenProps<'Register'>) {
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(makeRegisterSchema(t)),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const session = await registerRequest(values);
      await setSession(session);
    } catch (err) {
      setServerError(getErrorMessage(err));
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
        <Text style={styles.title}>{t('auth.register.title')}</Text>

        <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.register.nameLabel')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.register.emailLabel')}
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
              label={t('auth.register.passwordLabel')}
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
          testID="register-submit-button"
          label={t('auth.register.submitButton')}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>{t('auth.register.hasAccountLink')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
    title: {
      fontSize: fontSize.displayLg,
      fontFamily: typography.display.fontFamily,
      fontWeight: typography.display.fontWeight,
      color: colors.textPrimary,
      textAlign: 'center',
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useAuthStore } from '../../../store/useAuthStore';
import { loginRequest } from '../services/authApi';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const session = await loginRequest(values);
      await setSession(session);
    } catch {
      setServerError('E-posta veya şifre hatalı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>HomeOS</Text>
      <Text style={styles.tagline}>Evindeki her şey tek yerde.</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="E-posta"
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
              label="Şifre"
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
          label="Giriş yap"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useAuthStore } from '../../../store/useAuthStore';
import { registerRequest } from '../services/authApi';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

export function RegisterScreen({ navigation }: AuthStackScreenProps<'Register'>) {
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const session = await registerRequest(values);
      await setSession(session);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(message ?? 'Kayıt oluşturulamadı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap oluştur</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Ad Soyad"
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
              label="Şifre (en az 8 karakter)"
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
          label="Kayıt ol"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      </View>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
      </Pressable>
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { TextField } from '../../../ui/TextField';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useAuthStore } from '../../../store/useAuthStore';
import { useHomeStore } from '../../../store/useHomeStore';
import { getStoredRefreshToken } from '../../../services/secureStorage';
import { setStoredLanguage } from '../../../services/languageStorage';
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../../i18n';
import { LANGUAGE_NATIVE_NAMES } from '../../../i18n/languages';
import { logoutRequest } from '../../auth/services/authApi';
import { HOMES_QUERY_KEY, useHomesQuery } from '../../home/hooks/useHomesQuery';
import { leaveHome, updateHomeName } from '../../family/services/familyApi';
import { PROFILE_QUERY_KEY, useProfileQuery } from '../hooks/useProfileQuery';
import {
  changePassword,
  updateLanguage,
  updateNotificationPreferences,
  updateProfile,
} from '../services/settingsApi';
import {
  changePasswordSchema,
  homeNameSchema,
  type ChangePasswordFormValues,
  type HomeNameFormValues,
} from '../schemas/settingsSchema';

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export function SettingsScreen() {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError } = useProfileQuery();
  const { data: homes } = useHomesQuery();
  const currentHome = homes?.find((home) => home.id === homeId);
  const isOwner = currentHome?.role === 'owner';

  const [name, setName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingHomeName, setIsSavingHomeName] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language as SupportedLanguage);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, [profile]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const homeNameForm = useForm<HomeNameFormValues>({
    resolver: zodResolver(homeNameSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (currentHome) {
      homeNameForm.reset({ name: currentHome.name });
    }
    // homeNameForm is stable across renders (react-hook-form); only re-run when the home itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHome]);

  const handleSaveProfile = async () => {
    setIsSavingName(true);
    try {
      await updateProfile({ name });
      await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    } finally {
      setIsSavingName(false);
    }
  };

  const onChangePassword = async (values: ChangePasswordFormValues) => {
    setPasswordError(null);
    setIsChangingPassword(true);
    try {
      await changePassword(values);
      reset();
      Alert.alert('Şifre değiştirildi');
    } catch {
      setPasswordError('Mevcut şifre yanlış.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleNotification = async (
    key: 'expiryReminders' | 'shoppingUpdates' | 'weeklySummary',
    value: boolean,
  ) => {
    await updateNotificationPreferences({ [key]: value });
    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  };

  const handleChangeLanguage = async (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    await i18n.changeLanguage(language);
    await setStoredLanguage(language);
    await updateLanguage(language);
    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  };

  const onSaveHomeName = async (values: HomeNameFormValues) => {
    setIsSavingHomeName(true);
    try {
      await updateHomeName(homeId, values.name);
      await queryClient.invalidateQueries({ queryKey: HOMES_QUERY_KEY });
    } finally {
      setIsSavingHomeName(false);
    }
  };

  const handleLeaveHome = () => {
    Alert.alert('Bu evden ayrılmak istediğine emin misin?', undefined, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Ayrıl',
        style: 'destructive',
        onPress: async () => {
          await leaveHome(homeId);
          setSelectedHomeId(null);
          await queryClient.invalidateQueries({ queryKey: HOMES_QUERY_KEY });
        },
      },
    ]);
  };

  const handleLogout = async () => {
    const refreshToken = await getStoredRefreshToken();
    if (refreshToken) {
      await logoutRequest(refreshToken).catch(() => undefined);
    }
    await clearSession();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Ayarlar yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Hesap" />
      <Card style={styles.card}>
        <TextField label="İsim" value={name} onChangeText={setName} />
        <Button label="Kaydet" onPress={handleSaveProfile} loading={isSavingName} variant="secondary" />
      </Card>

      <Card style={styles.card}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Mevcut şifre"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.currentPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Yeni şifre"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.newPassword?.message}
            />
          )}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <Button
          label="Şifreyi değiştir"
          onPress={handleSubmit(onChangePassword)}
          loading={isChangingPassword}
          variant="secondary"
        />
      </Card>

      <SectionTitle title="Bildirimler" />
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>SKT hatırlatmaları</Text>
          <Switch
            value={profile.settings.notificationPreferences.expiryReminders}
            onValueChange={(value) => handleToggleNotification('expiryReminders', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Alışveriş güncellemeleri</Text>
          <Switch
            value={profile.settings.notificationPreferences.shoppingUpdates}
            onValueChange={(value) => handleToggleNotification('shoppingUpdates', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Haftalık özet</Text>
          <Switch
            value={profile.settings.notificationPreferences.weeklySummary}
            onValueChange={(value) => handleToggleNotification('weeklySummary', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Card>

      <SectionTitle title="Ev" />
      <Card style={styles.card}>
        <Controller
          control={homeNameForm.control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextField label="Ev adı" value={value} onChangeText={onChange} />
          )}
        />
        <Button
          label="Ev adını kaydet"
          onPress={homeNameForm.handleSubmit(onSaveHomeName)}
          loading={isSavingHomeName}
          variant="secondary"
        />
        {isOwner ? (
          <Text style={styles.hint}>
            Ev sahibi olarak, başka üyeler varken bu evden ayrılamazsın.
          </Text>
        ) : (
          <Button label="Evden ayrıl" onPress={handleLeaveHome} variant="outline" />
        )}
      </Card>

      <SectionTitle title="Uygulama" />
      <Card style={styles.card}>
        <Text style={styles.switchLabel}>Dil</Text>
        <View style={styles.languageChipsRow}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <Chip
              key={language}
              testID={`language-chip-${language}`}
              label={LANGUAGE_NATIVE_NAMES[language]}
              selected={currentLanguage === language}
              onPress={() => handleChangeLanguage(language)}
            />
          ))}
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tema</Text>
          <Text style={styles.readonlyValue}>Açık (v1)</Text>
        </View>
      </Card>

      <Button label="Çıkış yap" onPress={handleLogout} variant="outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.caption,
    fontFamily: typography.caption.fontFamily,
    color: colors.dangerDark,
  },
  sectionTitle: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.heading.fontFamily,
    fontWeight: typography.heading.fontWeight,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  card: { gap: spacing.md },
  languageChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textPrimary,
  },
  readonlyValue: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
  },
  hint: {
    fontSize: fontSize.caption,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
});

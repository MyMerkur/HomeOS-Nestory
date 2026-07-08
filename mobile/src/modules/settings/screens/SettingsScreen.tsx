import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextStyle } from 'react-native';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { TextField } from '../../../ui/TextField';
import { useToast } from '../../../ui/ToastProvider';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import type { ThemeMode } from '../../../services/themeStorage';
import { useAuthStore } from '../../../store/useAuthStore';
import { useHomeStore } from '../../../store/useHomeStore';
import { getStoredRefreshToken } from '../../../services/secureStorage';
import { setStoredLanguage } from '../../../services/languageStorage';
import { triggerHaptic } from '../../../services/haptics';
import { APP_VERSION } from '../../../config/appInfo';
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../../i18n';
import { LANGUAGE_NATIVE_NAMES } from '../../../i18n/languages';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';
import { logoutRequest } from '../../auth/services/authApi';
import { HOMES_QUERY_KEY, useHomesQuery } from '../../home/hooks/useHomesQuery';
import { leaveHome, updateHomeName } from '../../family/services/familyApi';
import { PROFILE_QUERY_KEY, useProfileQuery } from '../hooks/useProfileQuery';
import {
  changePassword,
  updateLanguage,
  updateNotificationPreferences,
  updateProfile,
  updateTheme,
} from '../services/settingsApi';
import {
  makeChangePasswordSchema,
  makeHomeNameSchema,
  type ChangePasswordFormValues,
  type HomeNameFormValues,
} from '../schemas/settingsSchema';

function SectionTitle({ title, style }: { title: string; style: TextStyle }) {
  return <Text style={style}>{title}</Text>;
}

const REMINDER_DAY_OPTIONS = [0, 1, 3, 7, 14, 30];

function hourToDate(hour: number): Date {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function SettingsScreen({ navigation }: DashboardStackScreenProps<'Settings'>) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError, refetch } = useProfileQuery();
  const { data: homes } = useHomesQuery();
  const currentHome = homes?.find((home) => home.id === homeId);
  const isOwner = currentHome?.role === 'owner';

  const [name, setName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingHomeName, setIsSavingHomeName] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language as SupportedLanguage);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLeavingHome, setIsLeavingHome] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    resolver: zodResolver(makeChangePasswordSchema(t)),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const homeNameForm = useForm<HomeNameFormValues>({
    resolver: zodResolver(makeHomeNameSchema(t)),
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
      triggerHaptic('notificationSuccess');
      showToast({ message: t('settings.passwordChangedMessage'), variant: 'success' });
    } catch {
      setPasswordError(t('settings.passwordErrorInvalid'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleNotification = async (
    key: 'expiryReminders' | 'shoppingUpdates' | 'weeklySummary' | 'dailyReminderEnabled',
    value: boolean,
  ) => {
    await updateNotificationPreferences({ [key]: value });
    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  };

  const handleToggleReminderDay = async (day: number, currentDays: number[]) => {
    const nextDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => b - a);
    await updateNotificationPreferences({ reminderDaysBefore: nextDays });
    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  };

  const handleChangeDailyReminderHour = async (date: Date) => {
    await updateNotificationPreferences({ dailyReminderHour: date.getHours() });
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
    Alert.alert(t('settings.leaveHomeConfirmTitle'), undefined, [
      { text: t('settings.leaveHomeConfirmCancel'), style: 'cancel' },
      {
        text: t('settings.leaveHomeConfirmConfirm'),
        style: 'destructive',
        onPress: async () => {
          triggerHaptic('notificationWarning');
          setIsLeavingHome(true);
          try {
            await leaveHome(homeId);
            setSelectedHomeId(null);
            await queryClient.invalidateQueries({ queryKey: HOMES_QUERY_KEY });
          } finally {
            setIsLeavingHome(false);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = await getStoredRefreshToken();
      if (refreshToken) {
        await logoutRequest(refreshToken).catch(() => undefined);
      }
      await clearSession();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleChangeTheme = async (nextMode: ThemeMode) => {
    setMode(nextMode);
    await updateTheme(nextMode);
    await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
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
        <Text style={styles.error}>{t('settings.errorLoad')}</Text>
        <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <SectionTitle title={t('settings.sectionAccount')} style={styles.sectionTitle} />
      <Card style={styles.card}>
        <TextField label={t('settings.nameLabel')} value={name} onChangeText={setName} />
        <Button
          label={t('settings.saveButton')}
          onPress={handleSaveProfile}
          loading={isSavingName}
          variant="secondary"
        />
      </Card>

      <Card style={styles.card}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <TextField
              label={t('settings.currentPasswordLabel')}
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
              label={t('settings.newPasswordLabel')}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.newPassword?.message}
            />
          )}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <Button
          label={t('settings.changePasswordButton')}
          onPress={handleSubmit(onChangePassword)}
          loading={isChangingPassword}
          variant="secondary"
        />
      </Card>

      <SectionTitle title={t('settings.sectionNotifications')} style={styles.sectionTitle} />
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('settings.notifExpiry')}</Text>
          <Switch
            value={profile.settings.notificationPreferences.expiryReminders}
            onValueChange={(value) => handleToggleNotification('expiryReminders', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('settings.notifShopping')}</Text>
          <Switch
            value={profile.settings.notificationPreferences.shoppingUpdates}
            onValueChange={(value) => handleToggleNotification('shoppingUpdates', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('settings.notifWeekly')}</Text>
          <Switch
            value={profile.settings.notificationPreferences.weeklySummary}
            onValueChange={(value) => handleToggleNotification('weeklySummary', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <Text style={styles.switchLabel}>{t('settings.reminderDaysLabel')}</Text>
        <View style={styles.languageChipsRow}>
          {REMINDER_DAY_OPTIONS.map((day) => (
            <Chip
              key={day}
              testID={`reminder-day-chip-${day}`}
              label={
                day === 0
                  ? t('settings.reminderDaySameDay')
                  : t('settings.reminderDaysBeforeLabel', { count: day })
              }
              selected={profile.settings.notificationPreferences.reminderDaysBefore.includes(day)}
              onPress={() =>
                handleToggleReminderDay(day, profile.settings.notificationPreferences.reminderDaysBefore)
              }
            />
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('settings.notifDaily')}</Text>
          <Switch
            value={profile.settings.notificationPreferences.dailyReminderEnabled}
            onValueChange={(value) => handleToggleNotification('dailyReminderEnabled', value)}
            trackColor={{ true: colors.primary }}
          />
        </View>
        {profile.settings.notificationPreferences.dailyReminderEnabled ? (
          <>
            <Pressable testID="daily-reminder-hour-button" onPress={() => setShowTimePicker(true)}>
              <Text style={styles.hint}>
                {t('settings.reminderHourLabel', {
                  hour: String(profile.settings.notificationPreferences.dailyReminderHour).padStart(2, '0'),
                })}
              </Text>
            </Pressable>
            {showTimePicker ? (
              <DateTimePicker
                value={hourToDate(profile.settings.notificationPreferences.dailyReminderHour)}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event, selectedTime) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (selectedTime) {
                    handleChangeDailyReminderHour(selectedTime);
                  }
                }}
              />
            ) : null}
          </>
        ) : null}
      </Card>

      <SectionTitle title={t('settings.sectionHome')} style={styles.sectionTitle} />
      <Card style={styles.card}>
        <Controller
          control={homeNameForm.control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextField label={t('settings.homeNameLabel')} value={value} onChangeText={onChange} />
          )}
        />
        <Button
          label={t('settings.saveHomeNameButton')}
          onPress={homeNameForm.handleSubmit(onSaveHomeName)}
          loading={isSavingHomeName}
          variant="secondary"
        />
        {isOwner ? (
          <Text style={styles.hint}>{t('settings.ownerCannotLeaveHint')}</Text>
        ) : (
          <Button
            label={t('settings.leaveHomeButton')}
            onPress={handleLeaveHome}
            loading={isLeavingHome}
            variant="outline"
          />
        )}
      </Card>

      <SectionTitle title={t('settings.sectionApp')} style={styles.sectionTitle} />
      <Card style={styles.card}>
        <Text style={styles.switchLabel}>{t('settings.languageLabel')}</Text>
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
        <Text style={styles.switchLabel}>{t('settings.themeLabel')}</Text>
        <SegmentedControl
          value={mode}
          onChange={(value) => handleChangeTheme(value as ThemeMode)}
          options={[
            { value: 'system', label: t('settings.themeSystem'), testID: 'theme-option-system' },
            { value: 'light', label: t('settings.themeLight'), testID: 'theme-option-light' },
            { value: 'dark', label: t('settings.themeDark'), testID: 'theme-option-dark' },
          ]}
        />
        <Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.link}>{t('settings.privacyPolicyLink')}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.link}>{t('settings.termsLink')}</Text>
        </Pressable>
        <Text style={styles.hint}>{t('settings.appVersionLabel', { version: APP_VERSION })}</Text>
      </Card>

      <Button
        label={t('settings.logoutButton')}
        onPress={handleLogout}
        loading={isLoggingOut}
        variant="outline"
      />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.md },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
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
    hint: {
      fontSize: fontSize.caption,
      fontFamily: typography.caption.fontFamily,
      color: colors.textSecondary,
    },
    link: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      color: colors.primary,
    },
  });
}

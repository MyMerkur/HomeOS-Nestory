import { useEffect } from 'react';
import {
  cancelDailyReminder,
  cancelWeeklySummary,
  ensureNotificationChannel,
  ensurePermission,
  scheduleDailyReminder,
  scheduleWeeklySummary,
  syncItemReminders,
} from '../../../services/notificationScheduler';
import { hasShownNotificationPrompt, markNotificationPromptShown } from '../../../services/notificationPromptStorage';
import { useProfileQuery } from '../../settings/hooks/useProfileQuery';
import { useAssetsQuery } from '../../assets/hooks/useAssetsQuery';
import { useInventoryItemsQuery } from './useInventoryItemsQuery';

export function useNotificationSync(): void {
  const { data } = useInventoryItemsQuery({ status: 'active', limit: 200 });
  const { data: assetsData } = useAssetsQuery({ status: 'active', limit: 200 });
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    ensureNotificationChannel();
  }, []);

  // Deferred so the permission dialog doesn't greet the user before they've
  // seen any real data — first successful load of their pantry counts as that.
  useEffect(() => {
    if (!data) return;
    hasShownNotificationPrompt().then((shown) => {
      if (!shown) {
        ensurePermission();
        markNotificationPromptShown();
      }
    });
  }, [data]);

  useEffect(() => {
    if (data) {
      syncItemReminders(data.items, assetsData?.assets ?? []);
    }
  }, [data, assetsData]);

  useEffect(() => {
    if (!profile) return;
    const prefs = profile.settings.notificationPreferences;

    if (prefs.dailyReminderEnabled) {
      scheduleDailyReminder(prefs.dailyReminderHour);
    } else {
      cancelDailyReminder();
    }

    if (prefs.weeklySummary) {
      scheduleWeeklySummary();
    } else {
      cancelWeeklySummary();
    }
  }, [profile]);
}

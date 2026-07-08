import notifee, { RepeatFrequency, TriggerType } from '@notifee/react-native';
import i18next from '../i18n';
import type { InventoryItem } from '../modules/pantry/services/pantryApi';
import type { Asset } from '../modules/assets/services/assetApi';

const CHANNEL_ID = 'expiry-reminders';
const DOSE_CHANNEL_ID = 'medicine-doses';
const WARRANTY_CHANNEL_ID = 'warranty-reminders';
const GENERAL_CHANNEL_ID = 'general-reminders';

const DAILY_REMINDER_ID = 'daily-reminder';
const WEEKLY_SUMMARY_ID = 'weekly-summary';

export async function ensureNotificationChannel(): Promise<void> {
  await notifee.createChannel({ id: CHANNEL_ID, name: i18next.t('notifications.channelExpiry') });
  await notifee.createChannel({ id: DOSE_CHANNEL_ID, name: i18next.t('notifications.channelDose') });
  await notifee.createChannel({
    id: WARRANTY_CHANNEL_ID,
    name: i18next.t('notifications.channelWarranty'),
  });
  await notifee.createChannel({ id: GENERAL_CHANNEL_ID, name: i18next.t('notifications.dailyReminderTitle') });
}

export async function ensurePermission(): Promise<void> {
  await notifee.requestPermission();
}

function buildNotificationId(itemId: string, daysBefore: number): string {
  return `${itemId}:${daysBefore}`;
}

function buildTriggerDate(expiryDate: Date, daysBefore: number): Date {
  const triggerDate = new Date(expiryDate);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);
  return triggerDate;
}

function bodyFor(itemName: string, daysBefore: number): string {
  return daysBefore === 0
    ? i18next.t('notifications.expiryBodyToday', { name: itemName })
    : i18next.t('notifications.expiryBodyDays', { name: itemName, count: daysBefore });
}

function buildDoseNotificationId(itemId: string, time: string): string {
  return `dose:${itemId}:${time}`;
}

function buildDoseTriggerDate(time: string, now: Date): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const triggerDate = new Date(now);
  triggerDate.setHours(hours, minutes, 0, 0);
  if (triggerDate.getTime() <= now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate;
}

function doseBodyFor(item: InventoryItem): string {
  const amount = item.doseAmount ?? 1;
  return i18next.t('notifications.doseBody', { name: item.name, amount, unit: item.unit });
}

function buildAssetNotificationId(assetId: string, daysBefore: number): string {
  return `asset:${assetId}:${daysBefore}`;
}

function warrantyBodyFor(assetName: string, daysBefore: number): string {
  return daysBefore === 0
    ? i18next.t('notifications.warrantyBodyToday', { name: assetName })
    : i18next.t('notifications.warrantyBodyDays', { name: assetName, count: daysBefore });
}

export async function syncItemReminders(items: InventoryItem[], assets: Asset[] = []): Promise<void> {
  const scheduledIds: string[] = await notifee.getTriggerNotificationIds();
  await Promise.all(scheduledIds.map((id) => notifee.cancelTriggerNotification(id)));

  const now = new Date();
  const activeItems = items.filter((item) => item.status === 'active');
  const activeAssets = assets.filter((asset) => asset.status === 'active');

  const expiryNotifications = activeItems
    .filter((item) => item.expiryDate)
    .flatMap((item) => {
      const expiryDate = new Date(item.expiryDate as string);
      return item.reminderDaysBefore
        .map((daysBefore) => ({ daysBefore, triggerDate: buildTriggerDate(expiryDate, daysBefore) }))
        .filter(({ triggerDate }) => triggerDate.getTime() > now.getTime())
        .map(({ daysBefore, triggerDate }) => ({ item, daysBefore, triggerDate }));
    });

  const doseNotifications = activeItems
    .filter((item) => item.category === 'Medicine' && item.doseTimes.length > 0)
    .flatMap((item) =>
      item.doseTimes.map((time) => ({ item, time, triggerDate: buildDoseTriggerDate(time, now) })),
    );

  const warrantyNotifications = activeAssets
    .filter((asset) => asset.warrantyEndDate)
    .flatMap((asset) => {
      const warrantyEndDate = new Date(asset.warrantyEndDate as string);
      return asset.reminderDaysBefore
        .map((daysBefore) => ({ daysBefore, triggerDate: buildTriggerDate(warrantyEndDate, daysBefore) }))
        .filter(({ triggerDate }) => triggerDate.getTime() > now.getTime())
        .map(({ daysBefore, triggerDate }) => ({ asset, daysBefore, triggerDate }));
    });

  await Promise.all([
    ...expiryNotifications.map(({ item, daysBefore, triggerDate }) =>
      notifee.createTriggerNotification(
        {
          id: buildNotificationId(item.id, daysBefore),
          title: i18next.t('notifications.expiryTitle'),
          body: bodyFor(item.name, daysBefore),
          android: { channelId: CHANNEL_ID },
        },
        { type: TriggerType.TIMESTAMP, timestamp: triggerDate.getTime() },
      ),
    ),
    ...doseNotifications.map(({ item, time, triggerDate }) =>
      notifee.createTriggerNotification(
        {
          id: buildDoseNotificationId(item.id, time),
          title: i18next.t('notifications.doseTitle'),
          body: doseBodyFor(item),
          android: { channelId: DOSE_CHANNEL_ID },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
        },
      ),
    ),
    ...warrantyNotifications.map(({ asset, daysBefore, triggerDate }) =>
      notifee.createTriggerNotification(
        {
          id: buildAssetNotificationId(asset.id, daysBefore),
          title: i18next.t('notifications.warrantyTitle'),
          body: warrantyBodyFor(asset.name, daysBefore),
          android: { channelId: WARRANTY_CHANNEL_ID },
        },
        { type: TriggerType.TIMESTAMP, timestamp: triggerDate.getTime() },
      ),
    ),
  ]);
}

function pickRandomMessage(): string {
  const messages = i18next.t('notifications.dailyReminderMessages', { returnObjects: true }) as string[];
  return messages[Math.floor(Math.random() * messages.length)];
}

function buildDailyTriggerDate(hour: number, now: Date): Date {
  const triggerDate = new Date(now);
  triggerDate.setHours(hour, 0, 0, 0);
  if (triggerDate.getTime() <= now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate;
}

// Scheduled with a fixed template message at schedule time — it cannot compute
// live pantry data when it later fires (see docs/ProjectDecisions.md).
export async function scheduleDailyReminder(hour: number): Promise<void> {
  await notifee.cancelTriggerNotification(DAILY_REMINDER_ID);
  const triggerDate = buildDailyTriggerDate(hour, new Date());

  await notifee.createTriggerNotification(
    {
      id: DAILY_REMINDER_ID,
      title: i18next.t('notifications.dailyReminderTitle'),
      body: pickRandomMessage(),
      android: { channelId: GENERAL_CHANNEL_ID },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
}

export async function cancelDailyReminder(): Promise<void> {
  await notifee.cancelTriggerNotification(DAILY_REMINDER_ID);
}

// Scheduled with a fixed template message at schedule time — it cannot compute
// live pantry data when it later fires (see docs/ProjectDecisions.md).
export async function scheduleWeeklySummary(): Promise<void> {
  await notifee.cancelTriggerNotification(WEEKLY_SUMMARY_ID);
  const triggerDate = buildDailyTriggerDate(9, new Date());

  await notifee.createTriggerNotification(
    {
      id: WEEKLY_SUMMARY_ID,
      title: i18next.t('notifications.weeklySummaryTitle'),
      body: i18next.t('notifications.weeklySummaryBody'),
      android: { channelId: GENERAL_CHANNEL_ID },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    },
  );
}

export async function cancelWeeklySummary(): Promise<void> {
  await notifee.cancelTriggerNotification(WEEKLY_SUMMARY_ID);
}

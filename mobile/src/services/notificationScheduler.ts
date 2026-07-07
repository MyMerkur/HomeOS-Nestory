import notifee, { RepeatFrequency, TriggerType } from '@notifee/react-native';
import type { InventoryItem } from '../modules/pantry/services/pantryApi';

const CHANNEL_ID = 'expiry-reminders';
const DOSE_CHANNEL_ID = 'medicine-doses';

export async function ensureNotificationChannel(): Promise<void> {
  await notifee.createChannel({ id: CHANNEL_ID, name: 'SKT Hatırlatmaları' });
  await notifee.createChannel({ id: DOSE_CHANNEL_ID, name: 'İlaç Hatırlatmaları' });
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
  const remaining = daysBefore === 0 ? 'bugün' : `${daysBefore} gün`;
  return `${itemName} için son kullanma tarihine ${remaining} kaldı.`;
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
  return `${item.name} alma vakti (${amount} ${item.unit}).`;
}

export async function syncItemReminders(items: InventoryItem[]): Promise<void> {
  const scheduledIds: string[] = await notifee.getTriggerNotificationIds();
  await Promise.all(scheduledIds.map((id) => notifee.cancelTriggerNotification(id)));

  const now = new Date();
  const activeItems = items.filter((item) => item.status === 'active');

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

  await Promise.all([
    ...expiryNotifications.map(({ item, daysBefore, triggerDate }) =>
      notifee.createTriggerNotification(
        {
          id: buildNotificationId(item.id, daysBefore),
          title: 'SKT Hatırlatma',
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
          title: 'İlaç Zamanı',
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
  ]);
}

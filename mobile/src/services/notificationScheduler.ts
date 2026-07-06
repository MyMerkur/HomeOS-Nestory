import notifee, { TriggerType } from '@notifee/react-native';
import type { InventoryItem } from '../modules/pantry/services/pantryApi';

const CHANNEL_ID = 'expiry-reminders';

export async function ensureNotificationChannel(): Promise<void> {
  await notifee.createChannel({ id: CHANNEL_ID, name: 'SKT Hatırlatmaları' });
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

export async function syncItemReminders(items: InventoryItem[]): Promise<void> {
  const scheduledIds: string[] = await notifee.getTriggerNotificationIds();
  await Promise.all(scheduledIds.map((id) => notifee.cancelTriggerNotification(id)));

  const now = new Date();

  const notifications = items
    .filter((item) => item.status === 'active' && item.expiryDate)
    .flatMap((item) => {
      const expiryDate = new Date(item.expiryDate as string);
      return item.reminderDaysBefore
        .map((daysBefore) => ({ daysBefore, triggerDate: buildTriggerDate(expiryDate, daysBefore) }))
        .filter(({ triggerDate }) => triggerDate.getTime() > now.getTime())
        .map(({ daysBefore, triggerDate }) => ({ item, daysBefore, triggerDate }));
    });

  await Promise.all(
    notifications.map(({ item, daysBefore, triggerDate }) =>
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
  );
}

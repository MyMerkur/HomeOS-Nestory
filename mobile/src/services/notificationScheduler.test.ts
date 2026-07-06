import notifee from '@notifee/react-native';
import { syncItemReminders } from './notificationScheduler';
import type { InventoryItem } from '../modules/pantry/services/pantryApi';

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function buildItem(overrides: Partial<InventoryItem>): InventoryItem {
  return {
    id: 'item-1',
    name: 'Süt',
    category: 'Dairy',
    quantity: 1,
    unit: 'liter',
    locationId: 'loc-1',
    expiryDate: null,
    purchaseDate: null,
    brand: null,
    barcode: null,
    status: 'active',
    notes: null,
    imageUrl: null,
    reminderDaysBefore: [7, 3, 1, 0],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('notificationScheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (notifee.getTriggerNotificationIds as jest.Mock).mockResolvedValue([]);
  });

  it('schedules a trigger for every future reminder day of an active item', async () => {
    const item = buildItem({ id: 'item-1', expiryDate: daysFromNow(10) });

    await syncItemReminders([item]);

    // reminderDaysBefore [7,3,1,0] against a 10-day-out expiry -> all 4 are still in the future
    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(4);
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'item-1:7' }),
      expect.objectContaining({ type: 0 }),
    );
  });

  it('skips reminder days that have already passed', async () => {
    const item = buildItem({ id: 'item-2', expiryDate: daysFromNow(2) });

    await syncItemReminders([item]);

    // reminderDaysBefore [7,3,1,0] against a 2-day-out expiry -> only 1 and 0 are still future
    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);
    const scheduledIds = (notifee.createTriggerNotification as jest.Mock).mock.calls.map(
      ([notification]) => notification.id,
    );
    expect(scheduledIds.sort()).toEqual(['item-2:0', 'item-2:1']);
  });

  it('does not schedule reminders for non-active items', async () => {
    const item = buildItem({ id: 'item-3', status: 'consumed', expiryDate: daysFromNow(10) });

    await syncItemReminders([item]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('cancels all previously scheduled reminders before rescheduling', async () => {
    (notifee.getTriggerNotificationIds as jest.Mock).mockResolvedValue(['old-1', 'old-2']);

    await syncItemReminders([]);

    expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('old-1');
    expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('old-2');
  });
});

import notifee from '@notifee/react-native';
import { cancelDailyReminder, scheduleDailyReminder, scheduleWeeklySummary, syncItemReminders } from './notificationScheduler';
import type { InventoryItem } from '../modules/pantry/services/pantryApi';
import type { Asset } from '../modules/assets/services/assetApi';

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function buildAsset(overrides: Partial<Asset>): Asset {
  return {
    id: 'asset-1',
    name: 'Televizyon',
    category: 'Electronics',
    room: null,
    brand: null,
    serialNumber: null,
    purchaseDate: null,
    price: null,
    warrantyEndDate: null,
    receiptImageUrl: null,
    warrantyDocumentUrl: null,
    notes: null,
    reminderDaysBefore: [30, 7, 1, 0],
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
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
    price: null,
    status: 'active',
    notes: null,
    imageUrl: null,
    reminderDaysBefore: [7, 3, 1, 0],
    doseAmount: null,
    doseTimes: [],
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

  it('schedules a daily-repeating dose reminder for each dose time of an active medicine', async () => {
    const item = buildItem({
      id: 'med-1',
      category: 'Medicine',
      doseAmount: 2,
      doseTimes: ['09:00', '21:00'],
    });

    await syncItemReminders([item]);

    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dose:med-1:09:00' }),
      expect.objectContaining({ type: 0, repeatFrequency: 1 }),
    );
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dose:med-1:21:00' }),
      expect.objectContaining({ type: 0, repeatFrequency: 1 }),
    );
  });

  it('does not schedule dose reminders for non-Medicine items even with doseTimes set', async () => {
    const item = buildItem({ id: 'item-4', category: 'Dairy', doseTimes: ['09:00'] });

    await syncItemReminders([item]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('does not schedule dose reminders for a medicine with no doseTimes', async () => {
    const item = buildItem({ id: 'med-2', category: 'Medicine', doseTimes: [] });

    await syncItemReminders([item]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('does not schedule dose reminders for an inactive medicine', async () => {
    const item = buildItem({
      id: 'med-3',
      category: 'Medicine',
      status: 'consumed',
      doseTimes: ['09:00'],
    });

    await syncItemReminders([item]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('schedules a trigger for every future reminder day of an active asset warranty', async () => {
    const asset = buildAsset({ id: 'asset-1', warrantyEndDate: daysFromNow(40) });

    await syncItemReminders([], [asset]);

    // reminderDaysBefore [30,7,1,0] against a 40-day-out warranty end -> all 4 are still future
    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(4);
    expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'asset:asset-1:30' }),
      expect.objectContaining({ type: 0 }),
    );
  });

  it('skips warranty reminder days that have already passed', async () => {
    const asset = buildAsset({ id: 'asset-2', warrantyEndDate: daysFromNow(5) });

    await syncItemReminders([], [asset]);

    // reminderDaysBefore [30,7,1,0] against a 5-day-out warranty end -> only 1 and 0 are future
    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(2);
    const scheduledIds = (notifee.createTriggerNotification as jest.Mock).mock.calls.map(
      ([notification]) => notification.id,
    );
    expect(scheduledIds.sort()).toEqual(['asset:asset-2:0', 'asset:asset-2:1']);
  });

  it('does not schedule warranty reminders for archived assets', async () => {
    const asset = buildAsset({ id: 'asset-3', status: 'archived', warrantyEndDate: daysFromNow(40) });

    await syncItemReminders([], [asset]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('does not schedule warranty reminders for an asset with no warrantyEndDate', async () => {
    const asset = buildAsset({ id: 'asset-4', warrantyEndDate: null });

    await syncItemReminders([], [asset]);

    expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
  });

  it('schedules items and asset warranties together without interfering with each other', async () => {
    const item = buildItem({ id: 'item-5', expiryDate: daysFromNow(10) });
    const asset = buildAsset({ id: 'asset-5', warrantyEndDate: daysFromNow(40) });

    await syncItemReminders([item], [asset]);

    expect(notifee.createTriggerNotification).toHaveBeenCalledTimes(8);
  });

  describe('scheduleDailyReminder', () => {
    it('cancels any existing daily reminder before scheduling a new repeating one', async () => {
      await scheduleDailyReminder(9);

      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('daily-reminder');
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'daily-reminder' }),
        expect.objectContaining({ type: 0, repeatFrequency: 1 }),
      );
    });
  });

  describe('cancelDailyReminder', () => {
    it('cancels the daily reminder trigger', async () => {
      await cancelDailyReminder();

      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('daily-reminder');
    });
  });

  describe('scheduleWeeklySummary', () => {
    it('cancels any existing weekly summary before scheduling a new repeating one', async () => {
      await scheduleWeeklySummary();

      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith('weekly-summary');
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'weekly-summary' }),
        expect.objectContaining({ type: 0, repeatFrequency: 2 }),
      );
    });
  });
});

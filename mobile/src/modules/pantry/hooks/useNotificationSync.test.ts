import { renderHook, waitFor } from '@testing-library/react-native';
import { useNotificationSync } from './useNotificationSync';
import { useInventoryItemsQuery } from './useInventoryItemsQuery';
import { useAssetsQuery } from '../../assets/hooks/useAssetsQuery';
import { useProfileQuery } from '../../settings/hooks/useProfileQuery';
import {
  cancelDailyReminder,
  cancelWeeklySummary,
  ensureNotificationChannel,
  ensurePermission,
  scheduleDailyReminder,
  scheduleWeeklySummary,
  syncItemReminders,
} from '../../../services/notificationScheduler';
import {
  hasShownNotificationPrompt,
  markNotificationPromptShown,
} from '../../../services/notificationPromptStorage';

jest.mock('./useInventoryItemsQuery');
jest.mock('../../assets/hooks/useAssetsQuery');
jest.mock('../../settings/hooks/useProfileQuery');
jest.mock('../../../services/notificationScheduler');
jest.mock('../../../services/notificationPromptStorage');

function mockProfile(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    settings: {
      notificationPreferences: {
        expiryReminders: true,
        shoppingUpdates: true,
        weeklySummary: true,
        reminderDaysBefore: [7, 3, 1, 0],
        dailyReminderEnabled: false,
        dailyReminderHour: 9,
        ...overrides,
      },
    },
  };
}

describe('useNotificationSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAssetsQuery as jest.Mock).mockReturnValue({ data: { assets: [] } });
    (hasShownNotificationPrompt as jest.Mock).mockResolvedValue(false);
  });

  it('creates notification channels on mount', () => {
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: undefined });
    (useProfileQuery as jest.Mock).mockReturnValue({ data: undefined });

    renderHook(() => useNotificationSync());

    expect(ensureNotificationChannel).toHaveBeenCalled();
  });

  it('requests permission and marks the prompt shown once data is available for the first time', async () => {
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: { items: [] } });
    (useProfileQuery as jest.Mock).mockReturnValue({ data: undefined });

    renderHook(() => useNotificationSync());

    await waitFor(() => expect(ensurePermission).toHaveBeenCalled());
    expect(markNotificationPromptShown).toHaveBeenCalled();
  });

  it('does not request permission again once the prompt has already been shown', async () => {
    (hasShownNotificationPrompt as jest.Mock).mockResolvedValue(true);
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: { items: [] } });
    (useProfileQuery as jest.Mock).mockReturnValue({ data: undefined });

    renderHook(() => useNotificationSync());

    await waitFor(() => expect(hasShownNotificationPrompt).toHaveBeenCalled());
    expect(ensurePermission).not.toHaveBeenCalled();
  });

  it('syncs item and asset reminders once inventory data loads', () => {
    const items = [{ id: 'item-1' }];
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: { items } });
    (useProfileQuery as jest.Mock).mockReturnValue({ data: undefined });

    renderHook(() => useNotificationSync());

    expect(syncItemReminders).toHaveBeenCalledWith(items, []);
  });

  it('schedules the daily reminder and weekly summary when enabled in preferences', () => {
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: undefined });
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: mockProfile({ dailyReminderEnabled: true, dailyReminderHour: 20, weeklySummary: true }),
    });

    renderHook(() => useNotificationSync());

    expect(scheduleDailyReminder).toHaveBeenCalledWith(20);
    expect(scheduleWeeklySummary).toHaveBeenCalled();
    expect(cancelDailyReminder).not.toHaveBeenCalled();
    expect(cancelWeeklySummary).not.toHaveBeenCalled();
  });

  it('cancels the daily reminder and weekly summary when disabled in preferences', () => {
    (useInventoryItemsQuery as jest.Mock).mockReturnValue({ data: undefined });
    (useProfileQuery as jest.Mock).mockReturnValue({
      data: mockProfile({ dailyReminderEnabled: false, weeklySummary: false }),
    });

    renderHook(() => useNotificationSync());

    expect(cancelDailyReminder).toHaveBeenCalled();
    expect(cancelWeeklySummary).toHaveBeenCalled();
    expect(scheduleDailyReminder).not.toHaveBeenCalled();
    expect(scheduleWeeklySummary).not.toHaveBeenCalled();
  });
});

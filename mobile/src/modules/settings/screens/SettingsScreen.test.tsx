import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SettingsScreen } from './SettingsScreen';
import {
  changePassword,
  deleteAccount,
  getProfile,
  updateNotificationPreferences,
  updateProfile,
  updateTheme,
  type UserProfile,
} from '../services/settingsApi';
import { listHomesRequest } from '../../home/services/homeApi';
import { leaveHome, updateHomeName } from '../../family/services/familyApi';
import { logoutRequest } from '../../auth/services/authApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import { ToastProvider } from '../../../ui/ToastProvider';
import * as secureStorage from '../../../services/secureStorage';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/settingsApi');
jest.mock('../../home/services/homeApi');
jest.mock('../../family/services/familyApi');
jest.mock('../../auth/services/authApi');
jest.mock('../../../services/secureStorage');

const PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Ayşe',
  email: 'ayse@example.com',
  avatarUrl: null,
  settings: {
    language: 'tr',
    theme: 'system',
    notificationPreferences: {
      expiryReminders: true,
      shoppingUpdates: true,
      weeklySummary: true,
      reminderDaysBefore: [7, 3, 1, 0],
      dailyReminderEnabled: false,
      dailyReminderHour: 9,
    },
  },
};

const OWNER_HOME = {
  id: 'home-1',
  name: 'Test Evi',
  timezone: 'Europe/Istanbul',
  defaultCurrency: 'TRY',
  role: 'owner' as const,
};

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as DashboardStackScreenProps<'Settings'>['navigation'];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsScreen navigation={mockNavigation} route={{} as never} />
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>,
  );
}

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    useAuthStore.setState({ user: { id: 'user-1', name: 'Ayşe', email: 'ayse@example.com' } });
    (getProfile as jest.Mock).mockResolvedValue(PROFILE);
    (listHomesRequest as jest.Mock).mockResolvedValue([OWNER_HOME]);
    (secureStorage.getStoredRefreshToken as jest.Mock).mockResolvedValue('refresh-token');
  });

  it('shows the profile name and notification toggles', async () => {
    renderScreen();

    expect(await screen.findByDisplayValue('Ayşe')).toBeTruthy();
    expect(screen.getByText('Expiry reminders')).toBeTruthy();
  });

  it('saves the profile name when Save is pressed', async () => {
    (updateProfile as jest.Mock).mockResolvedValue({ ...PROFILE, name: 'Ayşe Yılmaz' });
    renderScreen();
    const input = await screen.findByDisplayValue('Ayşe');

    fireEvent.changeText(input, 'Ayşe Yılmaz');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith({ name: 'Ayşe Yılmaz' }));
  });

  it('toggles a notification preference', async () => {
    (updateNotificationPreferences as jest.Mock).mockResolvedValue(PROFILE);
    renderScreen();
    await screen.findByText('Expiry reminders');

    fireEvent(screen.getAllByRole('switch')[0], 'valueChange', false);

    await waitFor(() =>
      expect(updateNotificationPreferences).toHaveBeenCalledWith({ expiryReminders: false }),
    );
  });

  it('toggles a reminder day threshold', async () => {
    (updateNotificationPreferences as jest.Mock).mockResolvedValue(PROFILE);
    renderScreen();
    await screen.findByTestId('reminder-day-chip-14');

    fireEvent.press(screen.getByTestId('reminder-day-chip-14'));

    await waitFor(() =>
      expect(updateNotificationPreferences).toHaveBeenCalledWith({
        reminderDaysBefore: [14, 7, 3, 1, 0],
      }),
    );
  });

  it('hides the reminder time picker button until the daily reminder is enabled', async () => {
    (updateNotificationPreferences as jest.Mock).mockResolvedValue(PROFILE);
    renderScreen();
    await screen.findByText('Daily reminder');

    expect(screen.queryByTestId('daily-reminder-hour-button')).toBeNull();

    fireEvent(screen.getAllByRole('switch')[3], 'valueChange', true);

    await waitFor(() =>
      expect(updateNotificationPreferences).toHaveBeenCalledWith({ dailyReminderEnabled: true }),
    );
  });

  it('shows an error when the current password is wrong', async () => {
    (changePassword as jest.Mock).mockRejectedValue(new Error('invalid'));
    renderScreen();
    await screen.findByText('Current password');

    fireEvent.changeText(screen.getByLabelText('Current password'), 'WrongPass!');
    fireEvent.changeText(screen.getByLabelText('New password'), 'NewPass123!');
    fireEvent.press(screen.getByText('Change password'));

    expect(await screen.findByText('Current password is incorrect.')).toBeTruthy();
  });

  it('does not offer to leave the home when the current user is the owner', async () => {
    renderScreen();

    await screen.findByText(/As the owner/);

    expect(screen.queryByText('Leave home')).toBeNull();
  });

  it('lets a non-owner leave the home', async () => {
    (listHomesRequest as jest.Mock).mockResolvedValue([{ ...OWNER_HOME, role: 'member' }]);
    (leaveHome as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const confirm = buttons?.find((button) => button.text === 'Leave');
      confirm?.onPress?.();
    });
    renderScreen();
    await screen.findByText('Leave home');

    fireEvent.press(screen.getByText('Leave home'));

    await waitFor(() => expect(leaveHome).toHaveBeenCalledWith('home-1'));
  });

  it('saves the home name when Save home name is pressed', async () => {
    (updateHomeName as jest.Mock).mockResolvedValue({ id: 'home-1', name: 'Yeni İsim' });
    renderScreen();
    const input = await screen.findByDisplayValue('Test Evi');

    fireEvent.changeText(input, 'Yeni İsim');
    fireEvent.press(screen.getByText('Save home name'));

    await waitFor(() => expect(updateHomeName).toHaveBeenCalledWith('home-1', 'Yeni İsim'));
  });

  it('updates the theme when a segmented option is pressed', async () => {
    (updateTheme as jest.Mock).mockResolvedValue({ ...PROFILE, settings: { ...PROFILE.settings, theme: 'dark' } });
    renderScreen();
    await screen.findByTestId('theme-option-dark');

    fireEvent.press(screen.getByTestId('theme-option-dark'));

    await waitFor(() => expect(updateTheme).toHaveBeenCalledWith('dark'));
  });

  it('logs out via the server endpoint and clears the local session', async () => {
    (logoutRequest as jest.Mock).mockResolvedValue(undefined);
    renderScreen();
    await screen.findByText('Log out');

    fireEvent.press(screen.getByText('Log out'));

    await waitFor(() => expect(logoutRequest).toHaveBeenCalledWith('refresh-token'));
    await waitFor(() => expect(useAuthStore.getState().accessToken).toBeNull());
  });

  it('shows the app version', async () => {
    renderScreen();

    expect(await screen.findByText(/Version 1\.0\.0/)).toBeTruthy();
  });

  it('navigates to the Privacy Policy screen', async () => {
    renderScreen();
    await screen.findByText('Privacy Policy');

    fireEvent.press(screen.getByText('Privacy Policy'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PrivacyPolicy');
  });

  it('navigates to the Terms of Service screen', async () => {
    renderScreen();
    await screen.findByText('Terms of Service');

    fireEvent.press(screen.getByText('Terms of Service'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Terms');
  });

  it('deletes the account after password confirmation and clears the session', async () => {
    (deleteAccount as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.find((button) => button.text === 'Delete')?.onPress?.();
    });
    renderScreen();
    await screen.findByTestId('delete-account-button');

    fireEvent.press(screen.getByTestId('delete-account-button'));
    fireEvent.changeText(screen.getByTestId('delete-account-password'), 'Min8Chars!');
    fireEvent.press(screen.getByTestId('delete-account-confirm-button'));

    await waitFor(() => expect(deleteAccount).toHaveBeenCalledWith('Min8Chars!'));
    await waitFor(() => expect(useAuthStore.getState().accessToken).toBeNull());
  });

  it('shows an error when the account deletion password is wrong', async () => {
    (deleteAccount as jest.Mock).mockRejectedValue(new Error('invalid'));
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.find((button) => button.text === 'Delete')?.onPress?.();
    });
    renderScreen();
    await screen.findByTestId('delete-account-button');

    fireEvent.press(screen.getByTestId('delete-account-button'));
    fireEvent.changeText(screen.getByTestId('delete-account-password'), 'WrongPass!');
    fireEvent.press(screen.getByTestId('delete-account-confirm-button'));

    expect(await screen.findByText('Incorrect password.')).toBeTruthy();
  });
});

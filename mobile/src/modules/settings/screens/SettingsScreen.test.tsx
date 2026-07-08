import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SettingsScreen } from './SettingsScreen';
import {
  changePassword,
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
import * as secureStorage from '../../../services/secureStorage';

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

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsScreen />
      </QueryClientProvider>
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
});

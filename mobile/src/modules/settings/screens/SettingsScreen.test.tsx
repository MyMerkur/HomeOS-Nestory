import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SettingsScreen } from './SettingsScreen';
import {
  changePassword,
  getProfile,
  updateNotificationPreferences,
  updateProfile,
  type UserProfile,
} from '../services/settingsApi';
import { listHomesRequest } from '../../home/services/homeApi';
import { leaveHome, updateHomeName } from '../../family/services/familyApi';
import { logoutRequest } from '../../auth/services/authApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { useAuthStore } from '../../../store/useAuthStore';
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
    <QueryClientProvider client={queryClient}>
      <SettingsScreen />
    </QueryClientProvider>,
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
    expect(screen.getByText('SKT hatırlatmaları')).toBeTruthy();
  });

  it('saves the profile name when Kaydet is pressed', async () => {
    (updateProfile as jest.Mock).mockResolvedValue({ ...PROFILE, name: 'Ayşe Yılmaz' });
    renderScreen();
    const input = await screen.findByDisplayValue('Ayşe');

    fireEvent.changeText(input, 'Ayşe Yılmaz');
    fireEvent.press(screen.getByText('Kaydet'));

    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith({ name: 'Ayşe Yılmaz' }));
  });

  it('toggles a notification preference', async () => {
    (updateNotificationPreferences as jest.Mock).mockResolvedValue(PROFILE);
    renderScreen();
    await screen.findByText('SKT hatırlatmaları');

    fireEvent(screen.getAllByRole('switch')[0], 'valueChange', false);

    await waitFor(() =>
      expect(updateNotificationPreferences).toHaveBeenCalledWith({ expiryReminders: false }),
    );
  });

  it('shows an error when the current password is wrong', async () => {
    (changePassword as jest.Mock).mockRejectedValue(new Error('invalid'));
    renderScreen();
    await screen.findByText('Mevcut şifre');

    fireEvent.changeText(screen.getByLabelText('Mevcut şifre'), 'WrongPass!');
    fireEvent.changeText(screen.getByLabelText('Yeni şifre'), 'NewPass123!');
    fireEvent.press(screen.getByText('Şifreyi değiştir'));

    expect(await screen.findByText('Mevcut şifre yanlış.')).toBeTruthy();
  });

  it('does not offer to leave the home when the current user is the owner', async () => {
    renderScreen();

    await screen.findByText(/Ev sahibi olarak/);

    expect(screen.queryByText('Evden ayrıl')).toBeNull();
  });

  it('lets a non-owner leave the home', async () => {
    (listHomesRequest as jest.Mock).mockResolvedValue([{ ...OWNER_HOME, role: 'member' }]);
    (leaveHome as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const confirm = buttons?.find((button) => button.text === 'Ayrıl');
      confirm?.onPress?.();
    });
    renderScreen();
    await screen.findByText('Evden ayrıl');

    fireEvent.press(screen.getByText('Evden ayrıl'));

    await waitFor(() => expect(leaveHome).toHaveBeenCalledWith('home-1'));
  });

  it('saves the home name when Ev adını kaydet is pressed', async () => {
    (updateHomeName as jest.Mock).mockResolvedValue({ id: 'home-1', name: 'Yeni İsim' });
    renderScreen();
    const input = await screen.findByDisplayValue('Test Evi');

    fireEvent.changeText(input, 'Yeni İsim');
    fireEvent.press(screen.getByText('Ev adını kaydet'));

    await waitFor(() => expect(updateHomeName).toHaveBeenCalledWith('home-1', 'Yeni İsim'));
  });

  it('logs out via the server endpoint and clears the local session', async () => {
    (logoutRequest as jest.Mock).mockResolvedValue(undefined);
    renderScreen();
    await screen.findByText('Çıkış yap');

    fireEvent.press(screen.getByText('Çıkış yap'));

    await waitFor(() => expect(logoutRequest).toHaveBeenCalledWith('refresh-token'));
    await waitFor(() => expect(useAuthStore.getState().accessToken).toBeNull());
  });
});

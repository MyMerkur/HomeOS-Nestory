import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegisterScreen } from './RegisterScreen';
import { registerRequest } from '../services/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/authApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as AuthStackScreenProps<'Register'>['navigation'];

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors for an invalid form', async () => {
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <RegisterScreen navigation={mockNavigation} route={{} as never} />
        </ThemeProvider>
      </SafeAreaProvider>,
    );

    fireEvent.changeText(screen.getByLabelText('Full name'), 'A');
    fireEvent.changeText(screen.getByLabelText('Password (at least 8 characters)'), '123');
    fireEvent.press(screen.getByText('Sign up'));

    expect(await screen.findByText('At least 2 characters')).toBeTruthy();
    expect(await screen.findByText('At least 8 characters')).toBeTruthy();
    expect(registerRequest).not.toHaveBeenCalled();
  });

  it('submits a valid form and starts a session', async () => {
    (registerRequest as jest.Mock).mockResolvedValue({
      user: { id: '1', name: 'Dogukan', email: 'dogukan@example.com' },
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <RegisterScreen navigation={mockNavigation} route={{} as never} />
        </ThemeProvider>
      </SafeAreaProvider>,
    );

    fireEvent.changeText(screen.getByLabelText('Full name'), 'Dogukan');
    fireEvent.changeText(screen.getByLabelText('Email'), 'dogukan@example.com');
    fireEvent.changeText(screen.getByLabelText('Password (at least 8 characters)'), 'Min8Chars!');
    fireEvent.press(screen.getByText('Sign up'));

    await waitFor(() =>
      expect(registerRequest).toHaveBeenCalledWith({
        name: 'Dogukan',
        email: 'dogukan@example.com',
        password: 'Min8Chars!',
      }),
    );

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBe('access'));
  });
});

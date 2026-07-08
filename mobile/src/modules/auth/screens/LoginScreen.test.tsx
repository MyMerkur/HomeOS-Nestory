import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { LoginScreen } from './LoginScreen';
import { loginRequest } from '../services/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { AuthStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/authApi');

const mockNavigation = { navigate: jest.fn() } as unknown as AuthStackScreenProps<'Login'>['navigation'];

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors for empty submission', async () => {
    render(
      <ThemeProvider>
        <LoginScreen navigation={mockNavigation} route={{} as never} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId('login-submit-button'));

    expect(await screen.findByText('Enter a valid email')).toBeTruthy();
    expect(loginRequest).not.toHaveBeenCalled();
  });

  it('submits valid credentials and starts a session', async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
      user: { id: '1', name: 'Test', email: 'test@example.com' },
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    render(
      <ThemeProvider>
        <LoginScreen navigation={mockNavigation} route={{} as never} />
      </ThemeProvider>,
    );

    fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'Min8Chars!');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => expect(loginRequest).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Min8Chars!',
    }));

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBe('access'));
  });
});

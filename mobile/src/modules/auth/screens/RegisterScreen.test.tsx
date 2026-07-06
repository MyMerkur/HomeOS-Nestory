import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from './RegisterScreen';
import { registerRequest } from '../services/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
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
    render(<RegisterScreen navigation={mockNavigation} route={{} as never} />);

    fireEvent.changeText(screen.getByPlaceholderText('Ad Soyad'), 'A');
    fireEvent.changeText(screen.getByPlaceholderText('Şifre (en az 8 karakter)'), '123');
    fireEvent.press(screen.getByText('Kayıt ol'));

    expect(await screen.findByText('En az 2 karakter')).toBeTruthy();
    expect(await screen.findByText('En az 8 karakter')).toBeTruthy();
    expect(registerRequest).not.toHaveBeenCalled();
  });

  it('submits a valid form and starts a session', async () => {
    (registerRequest as jest.Mock).mockResolvedValue({
      user: { id: '1', name: 'Dogukan', email: 'dogukan@example.com' },
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    render(<RegisterScreen navigation={mockNavigation} route={{} as never} />);

    fireEvent.changeText(screen.getByPlaceholderText('Ad Soyad'), 'Dogukan');
    fireEvent.changeText(screen.getByPlaceholderText('E-posta'), 'dogukan@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Şifre (en az 8 karakter)'), 'Min8Chars!');
    fireEvent.press(screen.getByText('Kayıt ol'));

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

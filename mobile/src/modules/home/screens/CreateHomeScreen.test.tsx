import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { CreateHomeScreen } from './CreateHomeScreen';
import { createHomeRequest } from '../services/homeApi';
import { useHomeStore } from '../../../store/useHomeStore';

jest.mock('../services/homeApi');

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateHomeScreen />
    </QueryClientProvider>,
  );
}

describe('CreateHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: null });
  });

  it('shows a validation error for an empty name', async () => {
    renderWithQueryClient();

    fireEvent.press(screen.getByTestId('create-home-submit'));

    expect(await screen.findByText('Ev adı gerekli')).toBeTruthy();
    expect(createHomeRequest).not.toHaveBeenCalled();
  });

  it('shows the invite code after creating a home and selects it on continue', async () => {
    (createHomeRequest as jest.Mock).mockResolvedValue({
      home: { id: 'home-1', name: 'My Home', timezone: 'Europe/Istanbul', defaultCurrency: 'TRY', role: 'owner' },
      inviteCode: 'ABCD1234',
    });

    renderWithQueryClient();

    fireEvent.changeText(screen.getByPlaceholderText('Ev adı (ör. Ev, Yazlık)'), 'My Home');
    fireEvent.press(screen.getByTestId('create-home-submit'));

    expect(await screen.findByTestId('invite-code')).toHaveTextContent('ABCD1234');

    fireEvent.press(screen.getByTestId('continue-button'));

    await waitFor(() => expect(useHomeStore.getState().selectedHomeId).toBe('home-1'));
  });
});

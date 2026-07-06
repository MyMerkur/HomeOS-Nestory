import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { JoinHomeScreen } from './JoinHomeScreen';
import { joinHomeRequest } from '../services/homeApi';
import { useHomeStore } from '../../../store/useHomeStore';

jest.mock('../services/homeApi');

function renderWithQueryClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <JoinHomeScreen />
    </QueryClientProvider>,
  );
}

describe('JoinHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: null });
  });

  it('shows a validation error for an empty invite code', async () => {
    renderWithQueryClient();

    fireEvent.press(screen.getByTestId('join-home-submit'));

    expect(await screen.findByText('Davet kodu gerekli')).toBeTruthy();
    expect(joinHomeRequest).not.toHaveBeenCalled();
  });

  it('joins a home with a valid invite code and selects it', async () => {
    (joinHomeRequest as jest.Mock).mockResolvedValue({
      id: 'home-2',
      name: 'Shared Home',
      timezone: 'Europe/Istanbul',
      defaultCurrency: 'TRY',
      role: 'member',
    });

    renderWithQueryClient();

    fireEvent.changeText(screen.getByPlaceholderText('Davet kodu'), 'ABCD1234');
    fireEvent.press(screen.getByTestId('join-home-submit'));

    await waitFor(() => expect(joinHomeRequest).toHaveBeenCalledWith({ inviteCode: 'ABCD1234' }));
    await waitFor(() => expect(useHomeStore.getState().selectedHomeId).toBe('home-2'));
  });
});

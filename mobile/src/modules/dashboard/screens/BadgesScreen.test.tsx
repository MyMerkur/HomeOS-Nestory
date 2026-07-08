import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { BadgesScreen } from './BadgesScreen';
import { getBadges } from '../services/badgeApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';

jest.mock('../services/badgeApi');

const mockBadges = [
  {
    id: 'first-item',
    name: 'İlk Ürün',
    description: 'Dolabına ilk ürününü ekle.',
    target: 1,
    progress: 1,
    earned: true,
  },
  {
    id: 'regular-tracker',
    name: 'Düzenli Takipçi',
    description: '10 ürün ekle.',
    target: 10,
    progress: 3,
    earned: false,
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BadgesScreen />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('BadgesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (getBadges as jest.Mock).mockResolvedValue(mockBadges);
  });

  it('shows earned and unearned badges with progress', async () => {
    renderScreen();

    expect(await screen.findByText('✓ İlk Ürün')).toBeTruthy();
    expect(screen.getByText('1/1')).toBeTruthy();
    expect(screen.getByText('Düzenli Takipçi')).toBeTruthy();
    expect(screen.getByText('3/10')).toBeTruthy();
  });

  it('refetches when the list is pulled to refresh', async () => {
    renderScreen();
    await screen.findByText('✓ İlk Ürün');

    fireEvent(screen.getByTestId('badges-list'), 'refresh');

    await waitFor(() => expect(getBadges).toHaveBeenCalledTimes(2));
  });
});

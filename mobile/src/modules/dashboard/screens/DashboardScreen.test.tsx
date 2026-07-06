import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DashboardScreen } from './DashboardScreen';
import { getDashboard } from '../services/dashboardApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/dashboardApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as DashboardStackScreenProps<'Dashboard'>['navigation'];

const mockDashboard = {
  expiringToday: 1,
  expiringIn3Days: 2,
  expiringInWeek: 3,
  totalActive: 10,
  upcomingItems: [
    {
      id: 'item-1',
      name: 'Süt',
      category: 'Dairy' as const,
      quantity: 1,
      unit: 'liter' as const,
      locationId: 'loc-fridge',
      expiryDate: '2026-07-06T00:00:00.000Z',
      purchaseDate: null,
      brand: null,
      barcode: null,
      status: 'active',
      notes: null,
      imageUrl: null,
      reminderDaysBefore: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardScreen navigation={mockNavigation} route={{} as never} />
    </QueryClientProvider>,
  );
}

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (getDashboard as jest.Mock).mockResolvedValue(mockDashboard);
  });

  it('shows the summary counts and upcoming items', async () => {
    renderScreen();

    expect(await screen.findByText('Süt')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('navigates to the item form in the Pantry tab when an upcoming item is pressed', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Süt'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PantryTab', {
      screen: 'ItemForm',
      params: { itemId: 'item-1' },
    });
  });
});

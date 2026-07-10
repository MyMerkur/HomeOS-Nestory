import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DashboardScreen } from './DashboardScreen';
import { getDashboard } from '../services/dashboardApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/dashboardApi');

const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
} as unknown as DashboardStackScreenProps<'Dashboard'>['navigation'];

const mockDashboard = {
  expiringToday: 1,
  expiringIn3Days: 2,
  expiringInWeek: 3,
  totalActive: 10,
  pantryItemCount: 8,
  medicineCount: 5,
  assetCount: 6,
  spending: { paidThisMonth: 250, unpaidTotal: 90 },
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
      doseAmount: null,
      doseTimes: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <SafeAreaProvider
      initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <DashboardScreen navigation={mockNavigation} route={{} as never} />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>,
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
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('250 ₺')).toBeTruthy();
    expect(screen.getByText('90 ₺')).toBeTruthy();
  });

  it('refetches when the list is pulled to refresh', async () => {
    renderScreen();
    await screen.findByText('Süt');

    fireEvent(screen.getByTestId('dashboard-list'), 'refresh');

    await waitFor(() => expect(getDashboard).toHaveBeenCalledTimes(2));
  });

  it('navigates to the item form in the Pantry tab when an upcoming item is pressed', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Süt'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PantryTab', {
      screen: 'ItemForm',
      params: { itemId: 'item-1' },
    });
  });

  it('navigates to the Badges screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-badges'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Badges');
  });

  it('navigates to the Medicines screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-medicines'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Medicines');
  });

  it('navigates to the Assets screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-assets'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Assets');
  });

  it('navigates to the Family screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-family'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Family');
  });

  it('navigates to the Settings screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-settings'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('navigates to the Bills screen from the side menu', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));

    fireEvent.press(await screen.findByTestId('go-to-bills'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Bills');
  });

  it('closes the side menu when the backdrop is pressed', async () => {
    renderScreen();
    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('open-side-menu'));
    await screen.findByTestId('go-to-badges');

    fireEvent.press(screen.getByTestId('side-menu-backdrop'));

    await waitFor(() => expect(screen.queryByTestId('go-to-badges')).toBeNull());
  });
});

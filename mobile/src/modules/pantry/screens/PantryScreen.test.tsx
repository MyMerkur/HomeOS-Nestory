import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { PantryScreen } from './PantryScreen';
import { listItems, listLocations } from '../services/pantryApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { MainStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as MainStackScreenProps<'Pantry'>['navigation'];

const mockLocations = [
  { id: 'loc-fridge', name: 'Buzdolabı', type: 'fridge', order: 0 },
  { id: 'loc-pantry', name: 'Kiler', type: 'pantry', order: 1 },
];

const mockItems = [
  {
    id: 'item-1',
    name: 'Süt',
    category: 'Dairy' as const,
    quantity: 1,
    unit: 'liter' as const,
    locationId: 'loc-fridge',
    expiryDate: null,
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
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PantryScreen navigation={mockNavigation} route={{} as never} />
    </QueryClientProvider>,
  );
}

describe('PantryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listLocations as jest.Mock).mockResolvedValue(mockLocations);
    (listItems as jest.Mock).mockResolvedValue({
      items: mockItems,
      pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
    });
  });

  it('shows the item list and location tabs', async () => {
    renderScreen();

    expect(await screen.findByText('Süt')).toBeTruthy();
    expect(screen.getByTestId('location-tab-loc-fridge')).toBeTruthy();
    expect(screen.getByTestId('location-tab-loc-pantry')).toBeTruthy();
  });

  it('refetches with the selected location id when a tab is pressed', async () => {
    renderScreen();

    await screen.findByText('Süt');

    fireEvent.press(screen.getByTestId('location-tab-loc-fridge'));

    await waitFor(() =>
      expect(listItems).toHaveBeenLastCalledWith(
        'home-1',
        expect.objectContaining({ locationId: 'loc-fridge' }),
      ),
    );
  });

  it('passes the search text through to the items query', async () => {
    renderScreen();

    await screen.findByText('Süt');

    fireEvent.changeText(screen.getByTestId('pantry-search'), 'süt');

    await waitFor(() =>
      expect(listItems).toHaveBeenLastCalledWith(
        'home-1',
        expect.objectContaining({ search: 'süt' }),
      ),
    );
  });
});

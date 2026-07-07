import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { PantryScreen } from './PantryScreen';
import {
  addToShopping,
  consumeItem,
  discardItem,
  freezeItem,
  listItems,
  listLocations,
} from '../services/pantryApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as PantryStackScreenProps<'Pantry'>['navigation'];

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
    doseAmount: null,
    doseTimes: [],
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

  it('consumes an item via the long-press action menu', async () => {
    (consumeItem as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Tükettim')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('item-card-item-1'), 'longPress');

    await waitFor(() => expect(consumeItem).toHaveBeenCalledWith('home-1', 'item-1'));
  });

  it('discards an item via the long-press action menu', async () => {
    (discardItem as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Attım')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('item-card-item-1'), 'longPress');

    await waitFor(() => expect(discardItem).toHaveBeenCalledWith('home-1', 'item-1'));
  });

  it('freezes an item via the long-press action menu', async () => {
    (freezeItem as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Dondurdum')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('item-card-item-1'), 'longPress');

    await waitFor(() => expect(freezeItem).toHaveBeenCalledWith('home-1', 'item-1'));
  });

  it('adds an item to the shopping list via the long-press action menu', async () => {
    (addToShopping as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Alışveriş listesine ekle')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('item-card-item-1'), 'longPress');

    await waitFor(() => expect(addToShopping).toHaveBeenCalledWith('home-1', 'item-1'));
  });

  it('navigates to QuickAddItem when the barcode FAB is pressed', async () => {
    renderScreen();
    await screen.findByText('Süt');

    fireEvent.press(screen.getByTestId('quick-add-barcode-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('QuickAddItem');
  });
});

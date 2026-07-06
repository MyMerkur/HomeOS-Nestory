import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ShoppingScreen } from './ShoppingScreen';
import {
  addShoppingItem,
  deleteShoppingItem,
  listShoppingItems,
  toggleShoppingItemCheck,
} from '../services/shoppingApi';
import { useHomeStore } from '../../../store/useHomeStore';

jest.mock('../services/shoppingApi');

const mockItems = [
  {
    id: 'item-1',
    name: 'Süt',
    quantity: 1,
    unit: null,
    category: null,
    status: 'pending' as const,
    checkedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'item-2',
    name: 'Ekmek',
    quantity: 1,
    unit: null,
    category: null,
    status: 'checked' as const,
    checkedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ShoppingScreen />
    </QueryClientProvider>,
  );
}

describe('ShoppingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listShoppingItems as jest.Mock).mockResolvedValue(mockItems);
  });

  it('shows pending and checked items', async () => {
    renderScreen();

    expect(await screen.findByText('Süt')).toBeTruthy();
    expect(screen.getByText('Ekmek')).toBeTruthy();
  });

  it('adds a new item', async () => {
    (addShoppingItem as jest.Mock).mockResolvedValue({ id: 'item-3' });
    renderScreen();

    await screen.findByText('Süt');
    fireEvent.changeText(screen.getByTestId('shopping-add-input'), 'Yumurta');
    fireEvent.press(screen.getByTestId('shopping-add-button'));

    await waitFor(() =>
      expect(addShoppingItem).toHaveBeenCalledWith('home-1', { name: 'Yumurta' }),
    );
  });

  it('toggles check status', async () => {
    (toggleShoppingItemCheck as jest.Mock).mockResolvedValue({});
    renderScreen();

    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('shopping-item-toggle-item-1'));

    await waitFor(() => expect(toggleShoppingItemCheck).toHaveBeenCalledWith('home-1', 'item-1'));
  });

  it('deletes an item', async () => {
    (deleteShoppingItem as jest.Mock).mockResolvedValue(undefined);
    renderScreen();

    await screen.findByText('Süt');
    fireEvent.press(screen.getByTestId('shopping-item-delete-item-1'));

    await waitFor(() => expect(deleteShoppingItem).toHaveBeenCalledWith('home-1', 'item-1'));
  });
});

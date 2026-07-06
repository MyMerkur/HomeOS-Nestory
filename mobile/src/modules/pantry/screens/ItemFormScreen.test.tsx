import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ItemFormScreen } from './ItemFormScreen';
import { createItem, getItem, listLocations, updateItem } from '../services/pantryApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { MainStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');

const mockLocations = [{ id: 'loc-fridge', name: 'Buzdolabı', type: 'fridge', order: 0 }];

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as MainStackScreenProps<'ItemForm'>['navigation'];

function renderScreen(itemId?: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ItemFormScreen
        navigation={mockNavigation}
        route={{ params: { itemId } } as MainStackScreenProps<'ItemForm'>['route']}
      />
    </QueryClientProvider>,
  );
}

describe('ItemFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listLocations as jest.Mock).mockResolvedValue(mockLocations);
  });

  it('shows validation errors when required fields are missing', async () => {
    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('item-form-submit'));

    expect(await screen.findByText('Ürün adı gerekli')).toBeTruthy();
    expect(createItem).not.toHaveBeenCalled();
  });

  it('creates an item with the selected location/category/unit', async () => {
    (createItem as jest.Mock).mockResolvedValue({ id: 'new-item' });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.changeText(screen.getByPlaceholderText('ör. Süt'), 'Yoğurt');
    fireEvent.press(screen.getByTestId('location-chip-loc-fridge'));
    fireEvent.press(screen.getByTestId('category-chip-Dairy'));
    fireEvent.press(screen.getByTestId('unit-chip-piece'));
    fireEvent.press(screen.getByTestId('item-form-submit'));

    await waitFor(() =>
      expect(createItem).toHaveBeenCalledWith(
        'home-1',
        expect.objectContaining({
          name: 'Yoğurt',
          locationId: 'loc-fridge',
          category: 'Dairy',
          unit: 'piece',
        }),
      ),
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('prefills and updates an existing item in edit mode', async () => {
    (getItem as jest.Mock).mockResolvedValue({
      id: 'item-1',
      name: 'Süt',
      category: 'Dairy',
      quantity: 1,
      unit: 'liter',
      locationId: 'loc-fridge',
      expiryDate: null,
    });
    (updateItem as jest.Mock).mockResolvedValue({ id: 'item-1' });

    renderScreen('item-1');

    expect(await screen.findByDisplayValue('Süt')).toBeTruthy();

    fireEvent.changeText(screen.getByDisplayValue('Süt'), 'Süt (yağlı)');
    fireEvent.press(screen.getByTestId('item-form-submit'));

    await waitFor(() =>
      expect(updateItem).toHaveBeenCalledWith(
        'home-1',
        'item-1',
        expect.objectContaining({ name: 'Süt (yağlı)' }),
      ),
    );
  });
});

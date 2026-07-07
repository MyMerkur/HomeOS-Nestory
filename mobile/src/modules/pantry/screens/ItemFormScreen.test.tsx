import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ItemFormScreen } from './ItemFormScreen';
import { createItem, getItem, listItems, listLocations, updateItem } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import { useHomeStore } from '../../../store/useHomeStore';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');
jest.mock('../services/barcodeScanner');
jest.mock('../services/dateOcrScanner');

const mockLocations = [{ id: 'loc-fridge', name: 'Buzdolabı', type: 'fridge', order: 0 }];

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as PantryStackScreenProps<'ItemForm'>['navigation'];

function renderScreen(itemId?: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ItemFormScreen
        navigation={mockNavigation}
        route={{ params: { itemId } } as PantryStackScreenProps<'ItemForm'>['route']}
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

  it('fills the barcode field after a successful scan', async () => {
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({
      status: 'found',
      value: '8690000000001',
    });
    (listItems as jest.Mock).mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 1, total: 0, totalPages: 1 },
    });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-barcode-button'));

    expect(await screen.findByDisplayValue('8690000000001')).toBeTruthy();
    expect(listItems).toHaveBeenCalledWith('home-1', { barcode: '8690000000001', limit: 1 });
  });

  it('warns when the barcode scan finds no barcode', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({ status: 'not-found' });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-barcode-button'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(listItems).not.toHaveBeenCalled();
  });

  it('does not warn when the barcode scan camera is cancelled', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({ status: 'cancelled' });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-barcode-button'));

    await waitFor(() => expect(scanBarcodeFromCamera).toHaveBeenCalled());
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('prefills name/category/unit when the scanned barcode matches an existing item', async () => {
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({
      status: 'found',
      value: '8690000000001',
    });
    (listItems as jest.Mock).mockResolvedValue({
      items: [
        {
          id: 'existing-item',
          name: 'Yoğurt',
          category: 'Dairy',
          quantity: 1,
          unit: 'piece',
          locationId: 'loc-fridge',
          barcode: '8690000000001',
        },
      ],
      pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
    });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-barcode-button'));

    expect(await screen.findByDisplayValue('Yoğurt')).toBeTruthy();
  });

  it('fills the expiry date after a successful OCR scan', async () => {
    (scanExpiryDateFromCamera as jest.Mock).mockResolvedValue({
      status: 'found',
      date: new Date(2026, 9, 10),
    });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-expiry-date-button'));

    expect(await screen.findByText('10.10.2026')).toBeTruthy();
  });

  it('warns when the OCR scan finds no date', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (scanExpiryDateFromCamera as jest.Mock).mockResolvedValue({ status: 'not-found' });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-expiry-date-button'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
  });

  it('does not warn when the OCR scan camera is cancelled', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (scanExpiryDateFromCamera as jest.Mock).mockResolvedValue({ status: 'cancelled' });

    renderScreen();

    await screen.findByTestId('location-chip-loc-fridge');
    fireEvent.press(screen.getByTestId('scan-expiry-date-button'));

    await waitFor(() => expect(scanExpiryDateFromCamera).toHaveBeenCalled());
    expect(alertSpy).not.toHaveBeenCalled();
  });
});

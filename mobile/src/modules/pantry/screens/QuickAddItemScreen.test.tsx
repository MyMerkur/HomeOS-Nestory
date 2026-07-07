import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QuickAddItemScreen } from './QuickAddItemScreen';
import { createItem, listItems, listLocations } from '../services/pantryApi';
import { scanBarcodeFromCamera } from '../services/barcodeScanner';
import { scanExpiryDateFromCamera } from '../services/dateOcrScanner';
import { useHomeStore } from '../../../store/useHomeStore';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');
jest.mock('../services/barcodeScanner');
jest.mock('../services/dateOcrScanner');

const mockLocations = [
  { id: 'loc-fridge', name: 'Buzdolabı', type: 'fridge', order: 0 },
  { id: 'loc-pantry', name: 'Kiler', type: 'pantry', order: 1 },
];

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as PantryStackScreenProps<'QuickAddItem'>['navigation'];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <QuickAddItemScreen navigation={mockNavigation} route={{} as never} />
    </QueryClientProvider>,
  );
}

describe('QuickAddItemScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listLocations as jest.Mock).mockResolvedValue(mockLocations);
  });

  it('warns when no barcode is recognized', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({ status: 'not-found' });

    renderScreen();
    fireEvent.press(screen.getByTestId('quick-add-scan-barcode-button'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(listItems).not.toHaveBeenCalled();
  });

  it('offers to open the full form when the barcode has no match', async () => {
    (scanBarcodeFromCamera as jest.Mock).mockResolvedValue({
      status: 'found',
      value: '8690000000001',
    });
    (listItems as jest.Mock).mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 1, total: 0, totalPages: 1 },
    });
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Forma Git')?.onPress?.();
    });

    renderScreen();
    fireEvent.press(screen.getByTestId('quick-add-scan-barcode-button'));

    await waitFor(() =>
      expect(mockNavigation.replace).toHaveBeenCalledWith('ItemForm', {
        initialBarcode: '8690000000001',
      }),
    );
  });

  it('shows a quick-add form pre-filled with the matched item and its location', async () => {
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
          quantity: 2,
          unit: 'piece',
          locationId: 'loc-pantry',
          barcode: '8690000000001',
        },
      ],
      pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
    });

    renderScreen();
    fireEvent.press(screen.getByTestId('quick-add-scan-barcode-button'));

    expect(await screen.findByText('Yoğurt')).toBeTruthy();
    expect(screen.getByTestId('quick-add-location-chip-loc-pantry').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#1d76db' })]),
    );
  });

  it('submits the quick-add form and creates the item', async () => {
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
          quantity: 2,
          unit: 'piece',
          locationId: 'loc-pantry',
          barcode: '8690000000001',
        },
      ],
      pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
    });
    (createItem as jest.Mock).mockResolvedValue({ id: 'new-item' });

    renderScreen();
    fireEvent.press(screen.getByTestId('quick-add-scan-barcode-button'));

    await screen.findByText('Yoğurt');
    fireEvent.press(screen.getByTestId('quick-add-submit'));

    await waitFor(() =>
      expect(createItem).toHaveBeenCalledWith(
        'home-1',
        expect.objectContaining({
          name: 'Yoğurt',
          category: 'Dairy',
          unit: 'piece',
          quantity: 2,
          locationId: 'loc-pantry',
          barcode: '8690000000001',
        }),
      ),
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('lets the user optionally scan the expiry date before submitting', async () => {
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
          quantity: 2,
          unit: 'piece',
          locationId: 'loc-pantry',
          barcode: '8690000000001',
        },
      ],
      pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
    });
    (scanExpiryDateFromCamera as jest.Mock).mockResolvedValue({
      status: 'found',
      date: new Date(2026, 9, 10),
    });
    (createItem as jest.Mock).mockResolvedValue({ id: 'new-item' });

    renderScreen();
    fireEvent.press(screen.getByTestId('quick-add-scan-barcode-button'));
    await screen.findByText('Yoğurt');

    fireEvent.press(screen.getByTestId('quick-add-scan-expiry-date-button'));
    expect(await screen.findByText('10.10.2026')).toBeTruthy();

    fireEvent.press(screen.getByTestId('quick-add-submit'));

    await waitFor(() =>
      expect(createItem).toHaveBeenCalledWith(
        'home-1',
        expect.objectContaining({ expiryDate: new Date(2026, 9, 10).toISOString() }),
      ),
    );
  });
});

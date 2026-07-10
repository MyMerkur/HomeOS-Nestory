import TextRecognition from '@react-native-ml-kit/text-recognition';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ReceiptScanScreen } from './ReceiptScanScreen';
import { createItem, listLocations } from '../services/pantryApi';
import { captureImage } from '../../../services/cameraCapture';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import { ToastProvider } from '../../../ui/ToastProvider';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/pantryApi');
jest.mock('../../../services/cameraCapture');

const mockLocations = [
  { id: 'loc-fridge', name: 'Buzdolabı', type: 'fridge', order: 0 },
  { id: 'loc-pantry', name: 'Kiler', type: 'pantry', order: 1 },
];

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as PantryStackScreenProps<'ReceiptScan'>['navigation'];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <ReceiptScanScreen navigation={mockNavigation} route={{} as never} />
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>,
  );
}

describe('ReceiptScanScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listLocations as jest.Mock).mockResolvedValue(mockLocations);
  });

  it('does nothing when the camera capture is cancelled', async () => {
    (captureImage as jest.Mock).mockResolvedValue(null);

    renderScreen();
    fireEvent.press(screen.getByTestId('receipt-scan-capture-button'));

    await waitFor(() => expect(captureImage).toHaveBeenCalled());
    expect(TextRecognition.recognize).not.toHaveBeenCalled();
    expect(screen.queryByTestId('receipt-scan-submit')).toBeNull();
  });

  it('shows an info message when no plausible product lines are detected', async () => {
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({ text: 'TOPLAM\n12,50', blocks: [] });

    renderScreen();
    fireEvent.press(screen.getByTestId('receipt-scan-capture-button'));

    expect(await screen.findByText("Couldn't detect any products on the receipt.")).toBeTruthy();
  });

  it('lists detected items for review after a successful scan', async () => {
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({
      text: 'Süt Tam Yağlı 1L\nEkmek Tam Buğday\nTOPLAM\n25,50',
      blocks: [],
    });

    renderScreen();
    fireEvent.press(screen.getByTestId('receipt-scan-capture-button'));

    expect(await screen.findByDisplayValue('Süt Tam Yağlı 1L')).toBeTruthy();
    expect(screen.getByDisplayValue('Ekmek Tam Buğday')).toBeTruthy();
  });

  it('excludes an unchecked item and creates the rest at the chosen location', async () => {
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({
      text: 'Süt Tam Yağlı 1L\nEkmek Tam Buğday',
      blocks: [],
    });
    (createItem as jest.Mock).mockResolvedValue({ id: 'new-item' });

    renderScreen();
    fireEvent.press(screen.getByTestId('receipt-scan-capture-button'));
    await screen.findByDisplayValue('Süt Tam Yağlı 1L');

    fireEvent.press(screen.getByTestId('receipt-scan-location-chip-loc-pantry'));
    fireEvent.press(screen.getByTestId('receipt-scan-item-toggle-1'));
    fireEvent.press(screen.getByTestId('receipt-scan-submit'));

    await waitFor(() => expect(createItem).toHaveBeenCalledTimes(1));
    expect(createItem).toHaveBeenCalledWith('home-1', {
      name: 'Süt Tam Yağlı 1L',
      locationId: 'loc-pantry',
      category: 'Other',
      unit: 'piece',
      quantity: 1,
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows an error toast when every item fails to save', async () => {
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({ text: 'Süt Tam Yağlı 1L', blocks: [] });
    (createItem as jest.Mock).mockRejectedValue(new Error('network error'));

    renderScreen();
    fireEvent.press(screen.getByTestId('receipt-scan-capture-button'));
    await screen.findByDisplayValue('Süt Tam Yağlı 1L');

    fireEvent.press(screen.getByTestId('receipt-scan-location-chip-loc-pantry'));
    fireEvent.press(screen.getByTestId('receipt-scan-submit'));

    expect(await screen.findByText("Couldn't save any of the items, try again.")).toBeTruthy();
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });
});

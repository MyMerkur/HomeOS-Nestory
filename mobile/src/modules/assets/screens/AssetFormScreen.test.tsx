import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { AssetFormScreen } from './AssetFormScreen';
import {
  createAsset,
  getAsset,
  updateAsset,
  uploadReceipt,
  uploadWarrantyDocument,
} from '../services/assetApi';
import { captureImage } from '../../../services/cameraCapture';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/assetApi');
jest.mock('../../../services/cameraCapture');
jest.mock('@react-native-ml-kit/text-recognition');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as DashboardStackScreenProps<'AssetForm'>['navigation'];

function renderScreen(assetId?: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AssetFormScreen
        navigation={mockNavigation}
        route={{ params: { assetId } } as DashboardStackScreenProps<'AssetForm'>['route']}
      />
    </QueryClientProvider>,
  );
}

describe('AssetFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
  });

  it('shows validation errors when required fields are missing', async () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('asset-form-submit'));

    expect(await screen.findByText('Asset name is required')).toBeTruthy();
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('creates an asset with the selected category', async () => {
    (createAsset as jest.Mock).mockResolvedValue({ id: 'new-asset' });

    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('e.g. Television'), 'Televizyon');
    fireEvent.press(screen.getByTestId('asset-category-chip-Electronics'));
    fireEvent.press(screen.getByTestId('asset-form-submit'));

    await waitFor(() =>
      expect(createAsset).toHaveBeenCalledWith(
        'home-1',
        expect.objectContaining({ name: 'Televizyon', category: 'Electronics' }),
      ),
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('prefills and updates an existing asset in edit mode', async () => {
    (getAsset as jest.Mock).mockResolvedValue({
      id: 'asset-1',
      name: 'Buzdolabı',
      category: 'Appliance',
      room: 'Mutfak',
      brand: null,
      serialNumber: null,
      purchaseDate: null,
      price: null,
      warrantyEndDate: null,
      notes: null,
    });
    (updateAsset as jest.Mock).mockResolvedValue({ id: 'asset-1' });

    renderScreen('asset-1');

    expect(await screen.findByDisplayValue('Buzdolabı')).toBeTruthy();

    fireEvent.changeText(screen.getByDisplayValue('Buzdolabı'), 'Buzdolabı (Bosch)');
    fireEvent.press(screen.getByTestId('asset-form-submit'));

    await waitFor(() =>
      expect(updateAsset).toHaveBeenCalledWith(
        'home-1',
        'asset-1',
        expect.objectContaining({ name: 'Buzdolabı (Bosch)' }),
      ),
    );
  });

  it('scans a receipt, prefills purchaseDate, and uploads immediately in edit mode', async () => {
    (getAsset as jest.Mock).mockResolvedValue({
      id: 'asset-1',
      name: 'Buzdolabı',
      category: 'Appliance',
    });
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({ text: '10.10.2026', blocks: [] });
    (uploadReceipt as jest.Mock).mockResolvedValue({ id: 'asset-1' });

    renderScreen('asset-1');
    await screen.findByDisplayValue('Buzdolabı');

    fireEvent.press(screen.getByTestId('scan-receipt-button'));

    await waitFor(() =>
      expect(uploadReceipt).toHaveBeenCalledWith('home-1', 'asset-1', 'file://receipt.jpg'),
    );
    expect(await screen.findByText('10/10/2026')).toBeTruthy();
    expect(await screen.findByText('Receipt added ✓')).toBeTruthy();
  });

  it('defers the receipt upload until after create in create mode', async () => {
    (captureImage as jest.Mock).mockResolvedValue('file://receipt.jpg');
    (TextRecognition.recognize as jest.Mock).mockResolvedValue({ text: 'no date here', blocks: [] });
    (createAsset as jest.Mock).mockResolvedValue({ id: 'new-asset' });
    (uploadReceipt as jest.Mock).mockResolvedValue({ id: 'new-asset' });

    renderScreen();

    fireEvent.press(screen.getByTestId('scan-receipt-button'));
    expect(await screen.findByText('Receipt added ✓')).toBeTruthy();
    expect(uploadReceipt).not.toHaveBeenCalled();

    fireEvent.changeText(screen.getByPlaceholderText('e.g. Television'), 'Televizyon');
    fireEvent.press(screen.getByTestId('asset-category-chip-Electronics'));
    fireEvent.press(screen.getByTestId('asset-form-submit'));

    await waitFor(() =>
      expect(uploadReceipt).toHaveBeenCalledWith('home-1', 'new-asset', 'file://receipt.jpg'),
    );
  });

  it('captures and uploads a warranty document immediately in edit mode', async () => {
    (getAsset as jest.Mock).mockResolvedValue({
      id: 'asset-1',
      name: 'Buzdolabı',
      category: 'Appliance',
    });
    (captureImage as jest.Mock).mockResolvedValue('file://warranty.jpg');
    (uploadWarrantyDocument as jest.Mock).mockResolvedValue({ id: 'asset-1' });

    renderScreen('asset-1');
    await screen.findByDisplayValue('Buzdolabı');

    fireEvent.press(screen.getByTestId('add-warranty-document-button'));

    await waitFor(() =>
      expect(uploadWarrantyDocument).toHaveBeenCalledWith('home-1', 'asset-1', 'file://warranty.jpg'),
    );
    expect(await screen.findByText('Document added ✓')).toBeTruthy();
  });
});

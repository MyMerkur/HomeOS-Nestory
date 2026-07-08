import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { AssetsScreen } from './AssetsScreen';
import { deleteAsset, listAssets, updateAsset } from '../services/assetApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/assetApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as DashboardStackScreenProps<'Assets'>['navigation'];

const mockAssets = [
  {
    id: 'asset-1',
    name: 'Televizyon',
    category: 'Electronics' as const,
    room: 'Oturma Odası',
    brand: null,
    serialNumber: null,
    purchaseDate: null,
    price: null,
    warrantyEndDate: null,
    receiptImageUrl: null,
    warrantyDocumentUrl: null,
    notes: null,
    reminderDaysBefore: [30, 7, 1, 0],
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AssetsScreen navigation={mockNavigation} route={{} as never} />
    </QueryClientProvider>,
  );
}

describe('AssetsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listAssets as jest.Mock).mockResolvedValue({
      assets: mockAssets,
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });
  });

  it('shows asset cards with category/room and a warranty badge', async () => {
    renderScreen();

    expect(await screen.findByText('Televizyon')).toBeTruthy();
    expect(screen.getByText('Electronics · Oturma Odası')).toBeTruthy();
    expect(screen.getByText('No warranty')).toBeTruthy();
  });

  it('navigates to AssetForm with the asset id on press', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Televizyon'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AssetForm', { assetId: 'asset-1' });
  });

  it('navigates to a blank AssetForm when the + button is pressed', async () => {
    renderScreen();

    fireEvent.press(await screen.findByTestId('add-asset-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AssetForm', undefined);
  });

  it('archives an asset via the long-press action menu', async () => {
    (updateAsset as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Archive')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('asset-card-asset-1'), 'longPress');

    await waitFor(() => expect(updateAsset).toHaveBeenCalledWith('home-1', 'asset-1', { status: 'archived' }));
  });

  it('deletes an asset via the long-press action menu', async () => {
    (deleteAsset as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Delete')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('asset-card-asset-1'), 'longPress');

    await waitFor(() => expect(deleteAsset).toHaveBeenCalledWith('home-1', 'asset-1'));
  });

  it('shows an empty state when there are no assets', async () => {
    (listAssets as jest.Mock).mockResolvedValue({
      assets: [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
    });

    renderScreen();

    expect(await screen.findByText('No assets registered yet.')).toBeTruthy();
  });
});

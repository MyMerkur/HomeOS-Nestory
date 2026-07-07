import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AssetFormScreen } from './AssetFormScreen';
import { createAsset, getAsset, updateAsset } from '../services/assetApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/assetApi');

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

    expect(await screen.findByText('Eşya adı gerekli')).toBeTruthy();
    expect(createAsset).not.toHaveBeenCalled();
  });

  it('creates an asset with the selected category', async () => {
    (createAsset as jest.Mock).mockResolvedValue({ id: 'new-asset' });

    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('ör. Televizyon'), 'Televizyon');
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
});

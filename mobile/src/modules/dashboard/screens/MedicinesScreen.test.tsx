import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { MedicinesScreen } from './MedicinesScreen';
import { addToShopping, listItems, takeDose } from '../../pantry/services/pantryApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';

jest.mock('../../pantry/services/pantryApi');

function buildMedicine(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'med-1',
    name: 'Parol',
    category: 'Medicine',
    quantity: 10,
    unit: 'piece',
    locationId: 'loc-pantry',
    expiryDate: null,
    purchaseDate: null,
    brand: null,
    barcode: null,
    status: 'active',
    notes: null,
    imageUrl: null,
    reminderDaysBefore: [],
    doseAmount: 2,
    doseTimes: ['09:00', '21:00'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MedicinesScreen />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('MedicinesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
  });

  it('renders medicines with their dose times', async () => {
    (listItems as jest.Mock).mockResolvedValue({
      items: [buildMedicine()],
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });

    renderScreen();

    expect(await screen.findByText('Parol')).toBeTruthy();
    expect(screen.getByText('Times: 09:00, 21:00')).toBeTruthy();
    expect(screen.getByTestId('take-dose-med-1')).toBeTruthy();
  });

  it('calls takeDose and refetches when "Took dose" is pressed', async () => {
    (listItems as jest.Mock).mockResolvedValue({
      items: [buildMedicine()],
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });
    (takeDose as jest.Mock).mockResolvedValue(buildMedicine({ quantity: 8 }));

    renderScreen();

    fireEvent.press(await screen.findByTestId('take-dose-med-1'));

    await waitFor(() => expect(takeDose).toHaveBeenCalledWith('home-1', 'med-1'));
  });

  it('shows a shopping-list shortcut instead of the dose button when out of stock', async () => {
    (listItems as jest.Mock).mockResolvedValue({
      items: [buildMedicine({ quantity: 0 })],
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });

    renderScreen();

    await screen.findByText('Parol');
    expect(screen.getByText(/Out of stock/)).toBeTruthy();
    expect(screen.queryByTestId('take-dose-med-1')).toBeNull();

    fireEvent.press(screen.getByTestId('add-to-shopping-med-1'));

    await waitFor(() => expect(addToShopping).toHaveBeenCalledWith('home-1', 'med-1'));
  });

  it('shows an empty state when there are no medicines', async () => {
    (listItems as jest.Mock).mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
    });

    renderScreen();

    expect(await screen.findByText('No medicines registered yet.')).toBeTruthy();
  });
});

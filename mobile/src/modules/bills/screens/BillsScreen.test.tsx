import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { BillsScreen } from './BillsScreen';
import { deleteBill, listBills, markBillPaid } from '../services/billApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/billApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as DashboardStackScreenProps<'Bills'>['navigation'];

const mockBills = [
  {
    id: 'bill-1',
    name: 'Elektrik',
    category: 'Electricity' as const,
    amount: 450,
    dueDate: '2099-01-15T00:00:00.000Z',
    isRecurring: true,
    status: 'unpaid' as const,
    paidAt: null,
    reminderDaysBefore: [3, 1, 0],
    notes: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BillsScreen navigation={mockNavigation} route={{} as never} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('BillsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (listBills as jest.Mock).mockResolvedValue({
      bills: mockBills,
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });
  });

  it('shows bill cards with category, amount, and recurring tag', async () => {
    renderScreen();

    expect(await screen.findByText('Elektrik')).toBeTruthy();
    expect(screen.getByText(/Electricity/)).toBeTruthy();
    expect(screen.getByText(/Recurring/)).toBeTruthy();
    expect(screen.getByText('450 ₺')).toBeTruthy();
  });

  it('navigates to BillForm with the bill id on press', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Elektrik'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('BillForm', { billId: 'bill-1' });
  });

  it('navigates to a blank BillForm when the + button is pressed', async () => {
    renderScreen();

    fireEvent.press(await screen.findByTestId('add-bill-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('BillForm', undefined);
  });

  it('marks a bill as paid via the long-press action menu', async () => {
    (markBillPaid as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Mark as paid')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('bill-card-bill-1'), 'longPress');

    await waitFor(() => expect(markBillPaid).toHaveBeenCalledWith('home-1', 'bill-1'));
  });

  it('deletes a bill via the long-press action menu', async () => {
    (deleteBill as jest.Mock).mockResolvedValue({});
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Delete')?.onPress?.();
    });

    renderScreen();
    fireEvent(await screen.findByTestId('bill-card-bill-1'), 'longPress');

    await waitFor(() => expect(deleteBill).toHaveBeenCalledWith('home-1', 'bill-1'));
  });

  it('does not offer "mark as paid" for an already-paid bill', async () => {
    (listBills as jest.Mock).mockResolvedValue({
      bills: [{ ...mockBills[0], status: 'paid', paidAt: '2026-01-10T00:00:00.000Z' }],
      pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
    });
    const alertSpy = jest.spyOn(Alert, 'alert');

    renderScreen();
    fireEvent(await screen.findByTestId('bill-card-bill-1'), 'longPress');

    const buttons = alertSpy.mock.calls[0][2];
    expect(buttons?.some((button) => button.text === 'Mark as paid')).toBe(false);
  });

  it('shows an empty state when there are no bills', async () => {
    (listBills as jest.Mock).mockResolvedValue({
      bills: [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
    });

    renderScreen();

    expect(await screen.findByText('No bills registered yet.')).toBeTruthy();
  });

  it('refetches when the list is pulled to refresh', async () => {
    renderScreen();
    await screen.findByText('Elektrik');

    fireEvent(screen.getByTestId('bills-list'), 'refresh');

    await waitFor(() => expect(listBills).toHaveBeenCalledTimes(2));
  });
});

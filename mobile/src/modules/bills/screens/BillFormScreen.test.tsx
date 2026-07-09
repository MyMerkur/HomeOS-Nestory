import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { BillFormScreen } from './BillFormScreen';
import { createBill, getBill, updateBill } from '../services/billApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/billApi');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as unknown as DashboardStackScreenProps<'BillForm'>['navigation'];

function renderScreen(billId?: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BillFormScreen
          navigation={mockNavigation}
          route={{ params: { billId } } as DashboardStackScreenProps<'BillForm'>['route']}
        />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('BillFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
  });

  it('shows validation errors when required fields are missing', async () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('bill-form-submit'));

    expect(await screen.findByText('Bill name is required')).toBeTruthy();
    expect(await screen.findByText('Select a due date')).toBeTruthy();
    expect(createBill).not.toHaveBeenCalled();
  });

  it('prefills and updates an existing bill, including toggling recurring', async () => {
    (getBill as jest.Mock).mockResolvedValue({
      id: 'bill-1',
      name: 'Elektrik',
      category: 'Electricity',
      amount: 450,
      dueDate: '2099-01-15T00:00:00.000Z',
      isRecurring: false,
      status: 'unpaid',
      paidAt: null,
      notes: null,
    });
    (updateBill as jest.Mock).mockResolvedValue({ id: 'bill-1' });

    renderScreen('bill-1');

    expect(await screen.findByDisplayValue('Elektrik')).toBeTruthy();
    fireEvent.changeText(screen.getByDisplayValue('Elektrik'), 'Elektrik Faturası');
    fireEvent(screen.getByTestId('bill-recurring-switch'), 'valueChange', true);
    fireEvent.press(screen.getByTestId('bill-form-submit'));

    await waitFor(() =>
      expect(updateBill).toHaveBeenCalledWith(
        'home-1',
        'bill-1',
        expect.objectContaining({
          name: 'Elektrik Faturası',
          isRecurring: true,
          dueDate: '2099-01-15T00:00:00.000Z',
        }),
      ),
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('does not call createBill when the due date is missing even if other fields are valid', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText('e.g. Electricity'), 'Su');
    fireEvent.press(screen.getByTestId('bill-category-chip-Water'));
    fireEvent.changeText(screen.getByLabelText('Amount'), '120');
    fireEvent.press(screen.getByTestId('bill-form-submit'));

    await waitFor(() => expect(createBill).not.toHaveBeenCalled());
  });
});

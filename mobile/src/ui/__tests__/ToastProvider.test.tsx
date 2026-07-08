import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { ToastProvider, useToast } from '../ToastProvider';

function Trigger() {
  const { showToast } = useToast();
  return (
    <TouchableOpacity onPress={() => showToast({ message: 'Saved', variant: 'success' })}>
      <Text>trigger</Text>
    </TouchableOpacity>
  );
}

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a toast when showToast is called and hides it after the duration', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    fireEvent.press(screen.getByText('trigger'));
    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('throws when useToast is used outside of ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow('useToast must be used within a ToastProvider');
    consoleError.mockRestore();
  });
});

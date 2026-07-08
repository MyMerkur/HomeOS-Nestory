import { act, render, screen } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider, useIsConnected } from './NetworkProvider';

function Probe() {
  const isConnected = useIsConnected();
  return <Text>{isConnected ? 'online' : 'offline'}</Text>;
}

function renderWithProviders() {
  return render(
    <SafeAreaProvider
      initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
    >
      <NetworkProvider>
        <Probe />
      </NetworkProvider>
    </SafeAreaProvider>,
  );
}

describe('NetworkProvider', () => {
  beforeEach(() => {
    (NetInfo.addEventListener as jest.Mock).mockClear();
  });

  it('does not show the offline banner while connected', () => {
    renderWithProviders();

    expect(screen.getByText('online')).toBeTruthy();
    expect(screen.queryByTestId('offline-banner')).toBeNull();
  });

  it('shows the offline banner when connectivity is lost', () => {
    renderWithProviders();
    const listener = (NetInfo.addEventListener as jest.Mock).mock.calls[0][0];

    act(() => {
      listener({ isConnected: false });
    });

    expect(screen.getByText('offline')).toBeTruthy();
    expect(screen.getByTestId('offline-banner')).toBeTruthy();
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeProvider } from '../../theme/ThemeContext';
import { recordError } from '../../services/crashReporting';

jest.mock('../../services/crashReporting', () => ({
  recordError: jest.fn(),
}));

function Bomb(): never {
  throw new Error('boom');
}

function renderBoundary(children: React.ReactNode) {
  return render(
    <SafeAreaProvider
      initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
    >
      <ThemeProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    renderBoundary(<Text>ok</Text>);

    expect(screen.getByText('ok')).toBeTruthy();
  });

  it('renders a fallback and reports the error when a child throws', () => {
    renderBoundary(<Bomb />);

    expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
    expect(recordError).toHaveBeenCalledWith(expect.any(Error), expect.stringContaining('ErrorBoundary'));
  });

  it('resets and re-renders children when retry is pressed', () => {
    let shouldThrow = true;
    function Flaky() {
      if (shouldThrow) throw new Error('boom');
      return <Text>recovered</Text>;
    }

    renderBoundary(<Flaky />);
    expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();

    shouldThrow = false;
    fireEvent.press(screen.getByTestId('error-boundary-retry'));

    expect(screen.getByText('recovered')).toBeTruthy();
  });
});

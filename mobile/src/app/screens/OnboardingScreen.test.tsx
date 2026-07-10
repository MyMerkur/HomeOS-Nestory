import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingScreen } from './OnboardingScreen';
import { ThemeProvider } from '../../theme/ThemeContext';

function renderScreen(onDone: () => void) {
  return render(
    <SafeAreaProvider
      initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
    >
      <ThemeProvider>
        <OnboardingScreen onDone={onDone} />
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}

describe('OnboardingScreen', () => {
  it('renders the tour slides', () => {
    renderScreen(jest.fn());

    expect(screen.getByTestId('onboarding-slide-pantry')).toBeTruthy();
    expect(screen.getByTestId('onboarding-slide-barcode')).toBeTruthy();
    expect(screen.getByTestId('onboarding-slide-family')).toBeTruthy();
    expect(screen.getByTestId('onboarding-slide-reminders')).toBeTruthy();
  });

  it('shows "Next" as the primary action on the first slide', () => {
    renderScreen(jest.fn());

    expect(screen.getByText('Next')).toBeTruthy();
  });

  it('calls onDone when skip is pressed', () => {
    const onDone = jest.fn();
    renderScreen(onDone);

    fireEvent.press(screen.getByTestId('onboarding-skip'));

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

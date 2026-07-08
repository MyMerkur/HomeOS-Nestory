import { render, screen } from '@testing-library/react-native';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';
import { ThemeProvider } from '../../../theme/ThemeContext';

describe('PrivacyPolicyScreen', () => {
  it('renders the privacy policy body text', () => {
    render(
      <ThemeProvider>
        <PrivacyPolicyScreen />
      </ThemeProvider>,
    );

    expect(screen.getByText(/This app stores your name/)).toBeTruthy();
  });
});

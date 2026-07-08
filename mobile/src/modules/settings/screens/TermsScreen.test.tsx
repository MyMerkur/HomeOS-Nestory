import { render, screen } from '@testing-library/react-native';
import { TermsScreen } from './TermsScreen';
import { ThemeProvider } from '../../../theme/ThemeContext';

describe('TermsScreen', () => {
  it('renders the terms of service body text', () => {
    render(
      <ThemeProvider>
        <TermsScreen />
      </ThemeProvider>,
    );

    expect(screen.getByText(/By using this app you agree/)).toBeTruthy();
  });
});

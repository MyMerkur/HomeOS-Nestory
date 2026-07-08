import { render, screen } from '@testing-library/react-native';
import { LoadingScreen } from './LoadingScreen';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('LoadingScreen', () => {
  it('renders the brand name', () => {
    render(
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>,
    );

    expect(screen.getByText('Nestory')).toBeTruthy();
  });
});

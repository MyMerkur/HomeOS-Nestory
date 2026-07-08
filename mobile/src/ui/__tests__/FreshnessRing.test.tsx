import { render, screen } from '@testing-library/react-native';
import { FreshnessRing } from '../FreshnessRing';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('FreshnessRing', () => {
  it('renders the day count and caption for the large variant', () => {
    render(
      <ThemeProvider>
        <FreshnessRing daysUntilExpiry={5} size="large" />
      </ThemeProvider>,
    );

    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('days left')).toBeTruthy();
  });

  it('clamps a negative day count to 0 in the label', () => {
    render(
      <ThemeProvider>
        <FreshnessRing daysUntilExpiry={-2} size="large" />
      </ThemeProvider>,
    );

    expect(screen.getByText('0')).toBeTruthy();
  });

  it('renders no text label for the small variant', () => {
    render(
      <ThemeProvider>
        <FreshnessRing daysUntilExpiry={5} size="small" />
      </ThemeProvider>,
    );

    expect(screen.queryByText('5')).toBeNull();
  });
});

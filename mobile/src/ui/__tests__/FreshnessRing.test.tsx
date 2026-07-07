import { render, screen } from '@testing-library/react-native';
import { FreshnessRing } from '../FreshnessRing';

describe('FreshnessRing', () => {
  it('renders the day count and caption for the large variant', () => {
    render(<FreshnessRing daysUntilExpiry={5} size="large" />);

    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('gün kaldı')).toBeTruthy();
  });

  it('clamps a negative day count to 0 in the label', () => {
    render(<FreshnessRing daysUntilExpiry={-2} size="large" />);

    expect(screen.getByText('0')).toBeTruthy();
  });

  it('renders no text label for the small variant', () => {
    render(<FreshnessRing daysUntilExpiry={5} size="small" />);

    expect(screen.queryByText('5')).toBeNull();
  });
});

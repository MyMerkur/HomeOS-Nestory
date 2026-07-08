import { render, screen } from '@testing-library/react-native';
import { SummaryCard } from '../SummaryCard';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('SummaryCard', () => {
  it('renders the value and caption', () => {
    render(
      <ThemeProvider>
        <SummaryCard value={3} caption="gün içinde bitecek" tint="danger" />
      </ThemeProvider>,
    );

    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('gün içinde bitecek')).toBeTruthy();
  });
});

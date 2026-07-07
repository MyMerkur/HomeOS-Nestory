import { render, screen } from '@testing-library/react-native';
import { SummaryCard } from '../SummaryCard';

describe('SummaryCard', () => {
  it('renders the value and caption', () => {
    render(<SummaryCard value={3} caption="gün içinde bitecek" tint="danger" />);

    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('gün içinde bitecek')).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react-native';
import { Skeleton } from '../Skeleton';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('Skeleton', () => {
  it('renders a pulsing placeholder block', () => {
    render(
      <ThemeProvider>
        <Skeleton width={120} height={20} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('skeleton')).toBeTruthy();
  });
});

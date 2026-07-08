import { fireEvent, render, screen } from '@testing-library/react-native';
import { PantryItemRow } from '../PantryItemRow';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('PantryItemRow', () => {
  it('renders the name and subtitle', () => {
    render(
      <ThemeProvider>
        <PantryItemRow name="Süt" subtitle="1 litre · Buzdolabı" daysUntilExpiry={3} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Süt')).toBeTruthy();
    expect(screen.getByText('1 litre · Buzdolabı')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <PantryItemRow name="Süt" subtitle="1 litre" daysUntilExpiry={3} onPress={onPress} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without a freshness ring when daysUntilExpiry is null', () => {
    render(
      <ThemeProvider>
        <PantryItemRow name="Tuz" subtitle="500 gram" daysUntilExpiry={null} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Tuz')).toBeTruthy();
  });

  it('calls onLongPress when long-pressed', () => {
    const onLongPress = jest.fn();
    render(
      <ThemeProvider>
        <PantryItemRow
          testID="row"
          name="Süt"
          subtitle="1 litre"
          daysUntilExpiry={3}
          onLongPress={onLongPress}
        />
      </ThemeProvider>,
    );

    fireEvent(screen.getByTestId('row'), 'longPress');

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});

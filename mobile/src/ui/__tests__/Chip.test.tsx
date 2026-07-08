import { fireEvent, render, screen } from '@testing-library/react-native';
import { Chip } from '../Chip';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('Chip', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Chip label="Süt Ürünleri" onPress={onPress} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText('Süt Ürünleri'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reflects selected state via accessibilityState', () => {
    render(
      <ThemeProvider>
        <Chip label="Süt Ürünleri" selected onPress={jest.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button').props.accessibilityState).toEqual({ selected: true });
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { Chip } from '../Chip';

describe('Chip', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Chip label="Süt Ürünleri" onPress={onPress} />);

    fireEvent.press(screen.getByText('Süt Ürünleri'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reflects selected state via accessibilityState', () => {
    render(<Chip label="Süt Ürünleri" selected onPress={jest.fn()} />);

    expect(screen.getByRole('button').props.accessibilityState).toEqual({ selected: true });
  });
});

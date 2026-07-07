import { fireEvent, render, screen } from '@testing-library/react-native';
import { IconPlus } from '@tabler/icons-react-native';
import { FAB } from '../FAB';

describe('FAB', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<FAB icon={IconPlus} onPress={onPress} accessibilityLabel="Ürün ekle" />);

    fireEvent.press(screen.getByLabelText('Ürün ekle'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { IconPlus } from '@tabler/icons-react-native';
import { FAB } from '../FAB';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('FAB', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <FAB icon={IconPlus} onPress={onPress} accessibilityLabel="Ürün ekle" />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByLabelText('Ürün ekle'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

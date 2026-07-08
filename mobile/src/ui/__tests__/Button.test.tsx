import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('Button', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Button label="Kaydet" onPress={onPress} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Button label="Kaydet" onPress={onPress} disabled />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Button label="Kaydet" onPress={onPress} loading />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.queryByText('Kaydet')).toBeNull();
  });
});

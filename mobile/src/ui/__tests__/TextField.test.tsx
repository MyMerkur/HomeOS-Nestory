import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextField } from '../TextField';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('TextField', () => {
  it('renders the label and forwards text input changes', () => {
    const onChangeText = jest.fn();
    render(
      <ThemeProvider>
        <TextField label="E-posta" value="" onChangeText={onChangeText} />
      </ThemeProvider>,
    );

    expect(screen.getByText('E-posta')).toBeTruthy();

    fireEvent.changeText(screen.getByDisplayValue(''), 'a@b.com');

    expect(onChangeText).toHaveBeenCalledWith('a@b.com');
  });

  it('shows the error message when provided', () => {
    render(
      <ThemeProvider>
        <TextField label="E-posta" value="" error="E-posta geçersiz" />
      </ThemeProvider>,
    );

    expect(screen.getByText('E-posta geçersiz')).toBeTruthy();
  });

  it('does not render error text when no error is given', () => {
    render(
      <ThemeProvider>
        <TextField label="E-posta" value="" />
      </ThemeProvider>,
    );

    expect(screen.queryByText(/geçersiz/)).toBeNull();
  });
});

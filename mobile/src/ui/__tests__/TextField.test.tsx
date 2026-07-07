import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextField } from '../TextField';

describe('TextField', () => {
  it('renders the label and forwards text input changes', () => {
    const onChangeText = jest.fn();
    render(<TextField label="E-posta" value="" onChangeText={onChangeText} />);

    expect(screen.getByText('E-posta')).toBeTruthy();

    fireEvent.changeText(screen.getByDisplayValue(''), 'a@b.com');

    expect(onChangeText).toHaveBeenCalledWith('a@b.com');
  });

  it('shows the error message when provided', () => {
    render(<TextField label="E-posta" value="" error="E-posta geçersiz" />);

    expect(screen.getByText('E-posta geçersiz')).toBeTruthy();
  });

  it('does not render error text when no error is given', () => {
    render(<TextField label="E-posta" value="" />);

    expect(screen.queryByText(/geçersiz/)).toBeNull();
  });
});

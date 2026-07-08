import { fireEvent, render, screen } from '@testing-library/react-native';
import { SegmentedControl } from '../SegmentedControl';
import { ThemeProvider } from '../../theme/ThemeContext';

const OPTIONS = [
  { value: 'fridge', label: 'Buzdolabı' },
  { value: 'freezer', label: 'Dondurucu' },
  { value: 'pantry', label: 'Kiler' },
];

describe('SegmentedControl', () => {
  it('calls onChange with the pressed option value', () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <SegmentedControl options={OPTIONS} value="fridge" onChange={onChange} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText('Kiler'));

    expect(onChange).toHaveBeenCalledWith('pantry');
  });

  it('marks the current value as selected', () => {
    render(
      <ThemeProvider>
        <SegmentedControl options={OPTIONS} value="freezer" onChange={jest.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Dondurucu' }).props.accessibilityState).toEqual({
      selected: true,
    });
  });
});

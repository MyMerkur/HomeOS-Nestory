import { fireEvent, render, screen } from '@testing-library/react-native';
import { SegmentedControl } from '../SegmentedControl';

const OPTIONS = [
  { value: 'fridge', label: 'Buzdolabı' },
  { value: 'freezer', label: 'Dondurucu' },
  { value: 'pantry', label: 'Kiler' },
];

describe('SegmentedControl', () => {
  it('calls onChange with the pressed option value', () => {
    const onChange = jest.fn();
    render(<SegmentedControl options={OPTIONS} value="fridge" onChange={onChange} />);

    fireEvent.press(screen.getByText('Kiler'));

    expect(onChange).toHaveBeenCalledWith('pantry');
  });

  it('marks the current value as selected', () => {
    render(<SegmentedControl options={OPTIONS} value="freezer" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Dondurucu' }).props.accessibilityState).toEqual({
      selected: true,
    });
  });
});

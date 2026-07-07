import { fireEvent, render, screen } from '@testing-library/react-native';
import { PantryItemRow } from '../PantryItemRow';

describe('PantryItemRow', () => {
  it('renders the name and subtitle', () => {
    render(<PantryItemRow name="Süt" subtitle="1 litre · Buzdolabı" daysUntilExpiry={3} />);

    expect(screen.getByText('Süt')).toBeTruthy();
    expect(screen.getByText('1 litre · Buzdolabı')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(
      <PantryItemRow name="Süt" subtitle="1 litre" daysUntilExpiry={3} onPress={onPress} />,
    );

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without a freshness ring when daysUntilExpiry is null', () => {
    render(<PantryItemRow name="Tuz" subtitle="500 gram" daysUntilExpiry={null} />);

    expect(screen.getByText('Tuz')).toBeTruthy();
  });
});

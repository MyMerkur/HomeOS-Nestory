import { fireEvent, render, screen } from '@testing-library/react-native';
import { IconMoodEmpty } from '@tabler/icons-react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" />);

    expect(screen.getByText('Bu bölüm boş')).toBeTruthy();
  });

  it('renders and triggers the action button when provided', () => {
    const onAction = jest.fn();
    render(
      <EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" actionLabel="Ürün ekle" onAction={onAction} />,
    );

    fireEvent.press(screen.getByText('Ürün ekle'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render an action button when none is provided', () => {
    render(<EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});

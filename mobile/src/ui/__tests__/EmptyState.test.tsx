import { fireEvent, render, screen } from '@testing-library/react-native';
import { IconMoodEmpty } from '@tabler/icons-react-native';
import { EmptyState } from '../EmptyState';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(
      <ThemeProvider>
        <EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Bu bölüm boş')).toBeTruthy();
  });

  it('renders and triggers the action button when provided', () => {
    const onAction = jest.fn();
    render(
      <ThemeProvider>
        <EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" actionLabel="Ürün ekle" onAction={onAction} />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByText('Ürün ekle'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render an action button when none is provided', () => {
    render(
      <ThemeProvider>
        <EmptyState icon={IconMoodEmpty} title="Bu bölüm boş" />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button')).toBeNull();
  });
});

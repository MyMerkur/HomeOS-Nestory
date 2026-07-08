import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../Card';
import { ThemeProvider } from '../../theme/ThemeContext';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <ThemeProvider>
        <Card>
          <Text>İçerik</Text>
        </Card>
      </ThemeProvider>,
    );

    expect(screen.getByText('İçerik')).toBeTruthy();
  });
});

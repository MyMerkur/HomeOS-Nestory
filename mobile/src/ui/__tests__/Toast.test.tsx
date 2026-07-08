import { render, screen } from '@testing-library/react-native';
import { Toast } from '../Toast';

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast message="Saved" variant="success" />);

    expect(screen.getByText('Saved')).toBeTruthy();
  });
});

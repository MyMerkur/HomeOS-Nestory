import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Appearance, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './ThemeContext';

function Probe() {
  const { colors, mode, resolvedMode, setMode } = useTheme();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="resolvedMode">{resolvedMode}</Text>
      <Text testID="background">{colors.background}</Text>
      <TouchableOpacity testID="setDark" onPress={() => setMode('dark')}>
        <Text>set dark</Text>
      </TouchableOpacity>
    </>
  );
}

describe('ThemeContext', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('defaults to system mode resolved from the device color scheme', () => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('system');
    expect(screen.getByTestId('resolvedMode')).toHaveTextContent('light');
  });

  it('updates colors and persists the mode when setMode is called', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('setDark'));
    });

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolvedMode')).toHaveTextContent('dark');
    expect(await AsyncStorage.getItem('homeos.theme')).toBe('dark');
  });

  it('loads a previously persisted mode on mount', async () => {
    await AsyncStorage.setItem('homeos.theme', 'dark');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('mode')).toHaveTextContent('dark'));
    expect(screen.getByTestId('resolvedMode')).toHaveTextContent('dark');
  });

  it('throws when useTheme is used outside of ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTheme must be used within a ThemeProvider');
    consoleError.mockRestore();
  });
});

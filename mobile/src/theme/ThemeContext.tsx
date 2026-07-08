import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { getStoredThemeMode, setStoredThemeMode, type ThemeMode } from '../services/themeStorage';
import { darkColors, lightColors, type ThemeColors } from './theme';

type ResolvedMode = 'light' | 'dark';

type ThemeContextValue = {
  colors: ThemeColors;
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveMode(mode: ThemeMode, systemScheme: ResolvedMode): ResolvedMode {
  return mode === 'system' ? systemScheme : mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ResolvedMode>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    getStoredThemeMode().then((stored) => {
      if (stored) setModeState(stored);
    });
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, []);

  const resolvedMode = resolveMode(mode, systemScheme);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    setStoredThemeMode(nextMode);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: resolvedMode === 'dark' ? darkColors : lightColors,
      mode,
      resolvedMode,
      setMode,
    }),
    [mode, resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * HomeOS / Nestory
 * @format
 */

import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/app/providers/QueryProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { LoadingScreen } from './src/app/screens/LoadingScreen';
import { useAuthStore } from './src/store/useAuthStore';
import { initI18n } from './src/i18n';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ToastProvider } from './src/ui/ToastProvider';

function AppContent() {
  const { resolvedMode } = useTheme();
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!isI18nReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'} />
      <ToastProvider>
        <QueryProvider>
          <RootNavigator />
        </QueryProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

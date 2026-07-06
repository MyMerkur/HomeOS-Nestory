/**
 * HomeOS / Nestory
 * @format
 */

import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/app/providers/QueryProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { useAuthStore } from './src/store/useAuthStore';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <QueryProvider>
        <RootNavigator />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

export default App;

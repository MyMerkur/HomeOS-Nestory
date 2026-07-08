/**
 * HomeOS / Nestory
 * @format
 */

import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/app/providers/QueryProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { useAuthStore } from './src/store/useAuthStore';
import { initI18n } from './src/i18n';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!isI18nReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <QueryProvider>
        <RootNavigator />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default App;

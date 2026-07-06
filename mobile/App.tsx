/**
 * HomeOS / Nestory
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/app/providers/QueryProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardPlaceholderScreen } from '../../modules/dashboard/screens/DashboardPlaceholderScreen';

export type RootStackParamList = {
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Sprint 1'de AuthStack / MainTabs ayrımı burada eklenecek (bkz. docs/Architecture.md).
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={DashboardPlaceholderScreen}
          options={{ title: 'HomeOS' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

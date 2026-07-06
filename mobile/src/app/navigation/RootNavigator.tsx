import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../../modules/auth/screens/RegisterScreen';
import { DashboardPlaceholderScreen } from '../../modules/dashboard/screens/DashboardPlaceholderScreen';
import type { AuthStackParamList, MainStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Sprint 1'de Home/Membership eklendiğinde CreateHome/JoinHome ekranları burada
// Dashboard'dan önce devreye girecek (bkz. docs/Architecture.md).
function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Dashboard"
        component={DashboardPlaceholderScreen}
        options={{ title: 'HomeOS' }}
      />
    </MainStack.Navigator>
  );
}

export function RootNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return <NavigationContainer>{accessToken ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useHomeStore } from '../../store/useHomeStore';
import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../../modules/auth/screens/RegisterScreen';
import { HomeSetupChoiceScreen } from '../../modules/home/screens/HomeSetupChoiceScreen';
import { CreateHomeScreen } from '../../modules/home/screens/CreateHomeScreen';
import { JoinHomeScreen } from '../../modules/home/screens/JoinHomeScreen';
import { useHomesQuery } from '../../modules/home/hooks/useHomesQuery';
import { DashboardPlaceholderScreen } from '../../modules/dashboard/screens/DashboardPlaceholderScreen';
import type { AuthStackParamList, HomeSetupStackParamList, MainStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeSetupStack = createNativeStackNavigator<HomeSetupStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function HomeSetupNavigator() {
  return (
    <HomeSetupStack.Navigator>
      <HomeSetupStack.Screen
        name="HomeSetupChoice"
        component={HomeSetupChoiceScreen}
        options={{ title: 'HomeOS' }}
      />
      <HomeSetupStack.Screen
        name="CreateHome"
        component={CreateHomeScreen}
        options={{ title: 'Ev oluştur' }}
      />
      <HomeSetupStack.Screen
        name="JoinHome"
        component={JoinHomeScreen}
        options={{ title: 'Eve katıl' }}
      />
    </HomeSetupStack.Navigator>
  );
}

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

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
}

function AuthenticatedNavigator() {
  const { data: homes, isLoading } = useHomesQuery();
  const selectedHomeId = useHomeStore((state) => state.selectedHomeId);
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);

  useEffect(() => {
    if (!selectedHomeId && homes && homes.length > 0) {
      setSelectedHomeId(homes[0].id);
    }
  }, [homes, selectedHomeId, setSelectedHomeId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!homes || homes.length === 0) {
    return <HomeSetupNavigator />;
  }

  return <MainNavigator />;
}

export function RootNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {accessToken ? <AuthenticatedNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

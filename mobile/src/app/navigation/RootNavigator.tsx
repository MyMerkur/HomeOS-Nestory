import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { DashboardScreen } from '../../modules/dashboard/screens/DashboardScreen';
import { PantryScreen } from '../../modules/pantry/screens/PantryScreen';
import { ItemFormScreen } from '../../modules/pantry/screens/ItemFormScreen';
import { ShoppingPlaceholderScreen } from '../../modules/shopping/screens/ShoppingPlaceholderScreen';
import type {
  AuthStackParamList,
  DashboardStackParamList,
  HomeSetupStackParamList,
  MainTabParamList,
  PantryStackParamList,
  ShoppingStackParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeSetupStack = createNativeStackNavigator<HomeSetupStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const PantryStack = createNativeStackNavigator<PantryStackParamList>();
const ShoppingStack = createNativeStackNavigator<ShoppingStackParamList>();

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

function DashboardTabNavigator() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Özet' }} />
    </DashboardStack.Navigator>
  );
}

function PantryTabNavigator() {
  return (
    <PantryStack.Navigator>
      <PantryStack.Screen name="Pantry" component={PantryScreen} options={{ title: 'Dolap' }} />
      <PantryStack.Screen name="ItemForm" component={ItemFormScreen} />
    </PantryStack.Navigator>
  );
}

function ShoppingTabNavigator() {
  return (
    <ShoppingStack.Navigator>
      <ShoppingStack.Screen
        name="Shopping"
        component={ShoppingPlaceholderScreen}
        options={{ title: 'Alışveriş' }}
      />
    </ShoppingStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator screenOptions={{ headerShown: false }}>
      <MainTab.Screen name="DashboardTab" component={DashboardTabNavigator} options={{ title: 'Özet' }} />
      <MainTab.Screen name="PantryTab" component={PantryTabNavigator} options={{ title: 'Dolap' }} />
      <MainTab.Screen
        name="ShoppingTab"
        component={ShoppingTabNavigator}
        options={{ title: 'Alışveriş' }}
      />
    </MainTab.Navigator>
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

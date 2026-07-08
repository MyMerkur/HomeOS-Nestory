import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconChefHat, IconFridge, IconHome2, IconShoppingCart } from '@tabler/icons-react-native';
import { useEffect, useMemo } from 'react';
import { typography, type ThemeColors } from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { useAuthStore } from '../../store/useAuthStore';
import { useHomeStore } from '../../store/useHomeStore';
import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../../modules/auth/screens/RegisterScreen';
import { HomeSetupChoiceScreen } from '../../modules/home/screens/HomeSetupChoiceScreen';
import { CreateHomeScreen } from '../../modules/home/screens/CreateHomeScreen';
import { JoinHomeScreen } from '../../modules/home/screens/JoinHomeScreen';
import { useHomesQuery } from '../../modules/home/hooks/useHomesQuery';
import { DashboardScreen } from '../../modules/dashboard/screens/DashboardScreen';
import { BadgesScreen } from '../../modules/dashboard/screens/BadgesScreen';
import { MedicinesScreen } from '../../modules/dashboard/screens/MedicinesScreen';
import { AssetsScreen } from '../../modules/assets/screens/AssetsScreen';
import { AssetFormScreen } from '../../modules/assets/screens/AssetFormScreen';
import { FamilyScreen } from '../../modules/family/screens/FamilyScreen';
import { SettingsScreen } from '../../modules/settings/screens/SettingsScreen';
import { PantryScreen } from '../../modules/pantry/screens/PantryScreen';
import { ItemFormScreen } from '../../modules/pantry/screens/ItemFormScreen';
import { QuickAddItemScreen } from '../../modules/pantry/screens/QuickAddItemScreen';
import { ShoppingScreen } from '../../modules/shopping/screens/ShoppingScreen';
import { RecipesScreen } from '../../modules/recipes/screens/RecipesScreen';
import { RecipeDetailScreen } from '../../modules/recipes/screens/RecipeDetailScreen';
import { useNotificationSync } from '../../modules/pantry/hooks/useNotificationSync';
import { registerForPushNotifications, subscribeToForegroundMessages } from '../../services/pushNotifications';
import type {
  AuthStackParamList,
  DashboardStackParamList,
  HomeSetupStackParamList,
  MainTabParamList,
  PantryStackParamList,
  RecipesStackParamList,
  ShoppingStackParamList,
} from './types';

function createStackHeaderScreenOptions(colors: ThemeColors) {
  return {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.primary,
    headerTitleStyle: {
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
    },
  };
}

function useStackHeaderScreenOptions() {
  const { colors } = useTheme();
  return useMemo(() => createStackHeaderScreenOptions(colors), [colors]);
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeSetupStack = createNativeStackNavigator<HomeSetupStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const PantryStack = createNativeStackNavigator<PantryStackParamList>();
const ShoppingStack = createNativeStackNavigator<ShoppingStackParamList>();
const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function HomeSetupNavigator() {
  const screenOptions = useStackHeaderScreenOptions();
  return (
    <HomeSetupStack.Navigator screenOptions={screenOptions}>
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
  const screenOptions = useStackHeaderScreenOptions();
  return (
    <DashboardStack.Navigator screenOptions={screenOptions}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Özet' }} />
      <DashboardStack.Screen name="Badges" component={BadgesScreen} options={{ title: 'Rozetlerim' }} />
      <DashboardStack.Screen
        name="Medicines"
        component={MedicinesScreen}
        options={{ title: 'İlaçlarım' }}
      />
      <DashboardStack.Screen name="Assets" component={AssetsScreen} options={{ title: 'Varlıklarım' }} />
      <DashboardStack.Screen name="AssetForm" component={AssetFormScreen} />
      <DashboardStack.Screen name="Family" component={FamilyScreen} options={{ title: 'Ailem' }} />
      <DashboardStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
    </DashboardStack.Navigator>
  );
}

function PantryTabNavigator() {
  const screenOptions = useStackHeaderScreenOptions();
  return (
    <PantryStack.Navigator screenOptions={screenOptions}>
      <PantryStack.Screen name="Pantry" component={PantryScreen} options={{ title: 'Dolap' }} />
      <PantryStack.Screen name="ItemForm" component={ItemFormScreen} />
      <PantryStack.Screen
        name="QuickAddItem"
        component={QuickAddItemScreen}
        options={{ title: 'Barkodla Hızlı Ekle' }}
      />
    </PantryStack.Navigator>
  );
}

function ShoppingTabNavigator() {
  const screenOptions = useStackHeaderScreenOptions();
  return (
    <ShoppingStack.Navigator screenOptions={screenOptions}>
      <ShoppingStack.Screen name="Shopping" component={ShoppingScreen} options={{ title: 'Alışveriş' }} />
    </ShoppingStack.Navigator>
  );
}

function RecipesTabNavigator() {
  const screenOptions = useStackHeaderScreenOptions();
  return (
    <RecipesStack.Navigator screenOptions={screenOptions}>
      <RecipesStack.Screen name="Recipes" component={RecipesScreen} options={{ title: 'Tarifler' }} />
      <RecipesStack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </RecipesStack.Navigator>
  );
}

function NotificationSync() {
  useNotificationSync();

  useEffect(() => {
    registerForPushNotifications();
    return subscribeToForegroundMessages();
  }, []);

  return null;
}

function DashboardTabIcon({ color, size }: { color: string; size: number }) {
  return <IconHome2 color={color} size={size} />;
}

function PantryTabIcon({ color, size }: { color: string; size: number }) {
  return <IconFridge color={color} size={size} />;
}

function ShoppingTabIcon({ color, size }: { color: string; size: number }) {
  return <IconShoppingCart color={color} size={size} />;
}

function RecipesTabIcon({ color, size }: { color: string; size: number }) {
  return <IconChefHat color={color} size={size} />;
}

function MainNavigator() {
  const { colors } = useTheme();
  const tabScreenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
    }),
    [colors],
  );

  return (
    <>
      <NotificationSync />
      <MainTab.Navigator screenOptions={tabScreenOptions}>
        <MainTab.Screen
          name="DashboardTab"
          component={DashboardTabNavigator}
          options={{ title: 'Özet', tabBarIcon: DashboardTabIcon }}
        />
        <MainTab.Screen
          name="PantryTab"
          component={PantryTabNavigator}
          options={{ title: 'Dolap', tabBarIcon: PantryTabIcon }}
        />
        <MainTab.Screen
          name="ShoppingTab"
          component={ShoppingTabNavigator}
          options={{ title: 'Alışveriş', tabBarIcon: ShoppingTabIcon }}
        />
        <MainTab.Screen
          name="RecipesTab"
          component={RecipesTabNavigator}
          options={{ title: 'Tarifler', tabBarIcon: RecipesTabIcon }}
        />
      </MainTab.Navigator>
    </>
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
  const { colors, resolvedMode } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = resolvedMode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
      },
    };
  }, [colors, resolvedMode]);

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {accessToken ? <AuthenticatedNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

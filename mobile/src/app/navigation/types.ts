import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RecipeSuggestion } from '../../modules/recipes/services/recipeApi';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeSetupStackParamList = {
  HomeSetupChoice: undefined;
  CreateHome: undefined;
  JoinHome: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  Badges: undefined;
  Medicines: undefined;
  Assets: undefined;
  AssetForm: { assetId?: string } | undefined;
  Family: undefined;
  Settings: undefined;
};

export type PantryStackParamList = {
  Pantry: undefined;
  ItemForm: { itemId?: string; initialBarcode?: string } | undefined;
  QuickAddItem: undefined;
};

export type ShoppingStackParamList = {
  Shopping: undefined;
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetail: { recipe: RecipeSuggestion };
};

export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList> | undefined;
  PantryTab: NavigatorScreenParams<PantryStackParamList> | undefined;
  ShoppingTab: NavigatorScreenParams<ShoppingStackParamList> | undefined;
  RecipesTab: NavigatorScreenParams<RecipesStackParamList> | undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeSetupScreenProps<T extends keyof HomeSetupStackParamList> = NativeStackScreenProps<
  HomeSetupStackParamList,
  T
>;

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DashboardStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type PantryStackScreenProps<T extends keyof PantryStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<PantryStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

export type ShoppingStackScreenProps<T extends keyof ShoppingStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ShoppingStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

export type RecipesStackScreenProps<T extends keyof RecipesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RecipesStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

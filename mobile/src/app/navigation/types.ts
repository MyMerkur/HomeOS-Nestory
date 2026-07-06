import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeSetupStackParamList = {
  HomeSetupChoice: undefined;
  CreateHome: undefined;
  JoinHome: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Pantry: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeSetupScreenProps<T extends keyof HomeSetupStackParamList> = NativeStackScreenProps<
  HomeSetupStackParamList,
  T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;

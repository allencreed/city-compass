import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Explore: { openLocationId?: string } | undefined;
  Ranks: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  CityOnboarding: undefined;
  BusinessJoin: undefined;
  BusinessDetail: { locationId: string };
  Passport: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

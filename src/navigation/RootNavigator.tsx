import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useSession } from '../context/SessionContext';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import BusinessJoinScreen from '../screens/BusinessJoinScreen';
import CityHubScreen from '../screens/CityHubScreen';
import CityOnboardingScreen from '../screens/CityOnboardingScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import PassportScreen from '../screens/PassportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { colors, fonts } from '../theme';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home: '🏠',
  Explore: '🧭',
  Ranks: '🏆',
  Profile: '👤',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 17, opacity: focused ? 1 : 0.45 }}>{TAB_ICONS[route.name]}</Text>
        ),
        tabBarActiveTintColor: colors.onAccentContainer,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarActiveBackgroundColor: colors.accentContainer,
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 3,
          marginVertical: 6,
        },
        tabBarLabelStyle: { fontFamily: fonts.label, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 68,
          shadowColor: '#031632',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={CityHubScreen} />
      <Tab.Screen name="Explore" component={MapScreen} />
      <Tab.Screen name="Ranks" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { loaded, profile, onboarded } = useSession();
  if (!loaded) return null; // App shows the splash until the session is read

  const initialRouteName: keyof RootStackParamList = onboarded
    ? 'Main'
    : profile
      ? 'CityOnboarding'
      : 'Login';

  return (
    // Keying by initial route remounts the stack on login/logout/onboarding,
    // landing the user on the right screen without manual navigation calls.
    <Stack.Navigator
      key={initialRouteName}
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="CityOnboarding" component={CityOnboardingScreen} />
      <Stack.Screen name="BusinessJoin" component={BusinessJoinScreen} />
      <Stack.Screen name="BusinessDetail" component={BusinessDetailScreen} />
      <Stack.Screen name="Passport" component={PassportScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

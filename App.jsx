import React, { useEffect, useState } from 'react';
import { StyleSheet, View,ActivityIndicator } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardsScreen from './screens/RewardsScreen';
import ReportScreen from './screens/ReportScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ReportInfoScreen from './screens/ReportInfoScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';

import colors from './constants/colors';
import { setUser } from './redux/userSlice';
import { store } from './redux/store';

const API_URL = Constants.expoConfig.extra.API_URL;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const iconSize = 28;

// Stack pour l’accueil + rapports
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="ReportInfo" component={ReportInfoScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}

// Stack pour authentification
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Onglets principaux
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Leaderboard':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Rewards':
              iconName = focused ? 'gift' : 'gift-outline';
              break;
          }
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: styles.tabBar.activeTintColor,
        tabBarInactiveTintColor: styles.tabBar.inactiveTintColor,
        tabBarStyle: styles.tabBar.style,
        tabBarLabelStyle: styles.tabBar.labelStyle,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation racine qui décide entre AuthStack et MainTabs
function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem('tokenJWT');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://${API_URL}:3001/v1/user/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        dispatch(setUser(data));
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
      setLoading(false);
    }

    checkAuth();
  }, [dispatch]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

// App principale
export default function App() {
  return (
    <Provider store={store}>
      <ActionSheetProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ActionSheetProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    activeTintColor: colors.primary,
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      height: 50,
      paddingBottom: 3,
      marginHorizontal: 20,
      borderRadius: 100,
      marginBottom: 10,
    },
    labelStyle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 25,
    },
  },
});

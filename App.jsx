import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardsScreen from './screens/RewardsScreen';
import ReportScreen from './screens/ReportScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
import ReportInfoScreen from './screens/ReportInfoScreen';

import colors from './constants/colors';
import { setUser } from './redux/userSlice';
import {store} from './redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const iconSize = 28;

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Report" component={ReportScreen} />
      <HomeStack.Screen name="ReportInfo" component={ReportInfoScreen} />
    </HomeStack.Navigator>
  );
}

function AuthStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
       <HomeStack.Screen name="Login">
        {props => <LoginScreen {...props}/>}
      </HomeStack.Screen>
      <HomeStack.Screen name="Register">
        {props => <RegisterScreen {...props}/>}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

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

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
 
    async function checkAuth() {
      const token = await AsyncStorage.getItem('tokenJWT');
      console.log("Checking authentication with token:", token);
      try {
        const response = await fetch(`http://${API_URL}:3001/user/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (!response.ok) {

          setStatus('unauthenticated');
          return;
        }

        const data = await response.json();
        console.log("User data fetched:", data);
        dispatch(setUser(data));
        setStatus('authenticated');
      } catch (error) {
        console.error("Error checking authentication:", error);
        setStatus('unauthenticated');
      }
    }
    checkAuth();
  }, [dispatch]);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'unauthenticated') {
    return <AuthStack />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <Provider store={store}>
      <ActionSheetProvider>
        <NavigationContainer>
          <AppContent />
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

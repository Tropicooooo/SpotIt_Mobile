import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Home from './screens/Home';
import Leaderboard from './screens/Leaderboard';
import Profile from './screens/Profile';
import Rewards from './screens/Rewards';
import Report from './screens/Report';

import colors from './constants/colors';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const iconSize = 28;

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="Report" component={Report} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
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
          <Tab.Screen name="Rewards" component={Rewards} />
          <Tab.Screen name="Leaderboard" component={Leaderboard} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
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

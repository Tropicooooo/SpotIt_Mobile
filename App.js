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
import Login from "./login";
import Register from "./register";
import LoadingScreen from "./LoadingScreen";
import { View, Image, Text } from "react-native";

import colors from './constants/colors';

const Stack = createStackNavigator();
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <Login
              {...props}
              onFormSwitch={(formName) => props.navigation.replace(formName)}
              onSkip={() => props.navigation.replace("Home")}
              onLoginSuccess={() => props.navigation.replace("Home")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" options={{ headerShown: false }}>
          {(props) => (
            <Register
              {...props}
              onFormSwitch={(formName) => props.navigation.replace(formName)}
              onSkip={() => props.navigation.replace("Home")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={require("./assets/logo.png")}
                style={{ width: 100, height: 100, marginBottom: 20 }}
              />
              <Text>Bienvenue dans l'application !</Text>
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

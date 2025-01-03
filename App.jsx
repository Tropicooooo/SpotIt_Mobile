import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardsScreen from './screens/RegisterScreen';
import ReportScreen from './screens/ReportScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
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
            <LoginScreen
              {...props}
              onFormSwitch={(formName) => props.navigation.replace(formName)}
              onSkip={() => props.navigation.replace("Home")}
              onLoginSuccess={() => props.navigation.replace("Home")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" options={{ headerShown: false }}>
          {(props) => (
            <RegisterScreen
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

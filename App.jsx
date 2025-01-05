import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const onSkip = () => {
    setIsAuthenticated(false); // Ou autre logique pour bypasser la connexion
  };

  const onFormSwitch = (form) => {
    // Gérer la logique de changement de formulaire ici, par exemple pour enregistrer un utilisateur
    console.log(form);
  };

  if (isAuthenticated === null) {
    return <LoadingScreen />; // Afficher un écran de chargement pendant la vérification de l'authentification
  }

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {isAuthenticated ? (
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
        ) : (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen 
              name="Login" 
              component={(props) => (
                <LoginScreen 
                  {...props} 
                  onLoginSuccess={onLoginSuccess} 
                  onSkip={onSkip} 
                  onFormSwitch={(form) => onFormSwitch(form, props.navigation)} // Passer la navigation ici
                />
              )} 
            />
            <HomeStack.Screen name="Register" component={RegisterScreen} />
          </HomeStack.Navigator>
        )}
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

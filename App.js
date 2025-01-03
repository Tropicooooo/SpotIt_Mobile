import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./LoadingScreen";
import Login from "./login";
import Register from "./register";
import { View, Image, Text } from "react-native";

const Stack = createStackNavigator();

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

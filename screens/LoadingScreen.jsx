import React, { useEffect } from "react";
import { View, Image, ActivityIndicator } from "react-native";

import styles from '../styles/LoadingScreenStyles.jsx';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    </View>
  );
};

export default LoadingScreen;
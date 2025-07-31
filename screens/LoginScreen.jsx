import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
import styles from '../styles/LoginScreenStyles.jsx';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${API_URL}:3001/manager/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        onLoginSuccess();
      } else {
        alert("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion");
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    Alert.alert("Fonctionnalité indisponible pour le moment");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.header}>Connexion</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="youremail@gmail.com"
              keyboardType="email-address"
            />
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Mot de passe oublié</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Connexion</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Pas de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default LoginScreen;

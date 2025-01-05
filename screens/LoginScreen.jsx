import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import styles from '../styles/LoginScreenStyles.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onFormSwitch, onSkip, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.46:3001/manager/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('tokenJWT', data.token);
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
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Connexion</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onFormSwitch("Register")}>
            <Text style={styles.link}>Pas de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.link}>Skip</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

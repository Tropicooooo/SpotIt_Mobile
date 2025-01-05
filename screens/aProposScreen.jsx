import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-native-paper";
import styles from "../styles/AProposScreenStyles.jsx";

export default function aProposScreen({ navigation }) {
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>À propos</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={() => navigation.navigate("HomeScreen")}>
            <Ionicons name="arrow-back-outline" size={30} color="green" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.aboutText}>
            Bienvenue sur Spotit ! Cette application est un projet d'étude de 4 étudiants en informatique.
            Le projet a pour but d'aider la commune à prendre plus rapidement en charge les problèmes de la ville grâce à un système de signalement des utilisateurs.
          </Text>
        </ScrollView>
      </View>
    </Provider>
  );
}

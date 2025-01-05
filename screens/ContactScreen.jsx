import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-native-paper";
import styles from "../styles/ContactScreenStyles.jsx";

export default function ContactScreen({ navigation }) {
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>Contact</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={() => navigation.navigate("HomeScreen")}>
            <Ionicons name="arrow-back-outline" size={30} color="green" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.contactText}>
            Pour nous contacter, merci de passer par notre adresse mail SpotitCorp@henallux.be.
          </Text>
        </ScrollView>
      </View>
    </Provider>
  );
}

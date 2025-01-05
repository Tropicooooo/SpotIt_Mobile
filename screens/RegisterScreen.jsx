import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import TextInputField from '../components/TextInputField';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import styles from '../styles/RegisterScreenStyles.jsx';

export default function RegisterScreen({ onFormSwitch, onSkip }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.25:3001/manager/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstname: name,
          lastname: lastName,
          password,
          birthdate: birthdate.toISOString().split("T")[0],
          phone: "0123456789", 
          cityLabel: "Paris",
          postalCode: 75000,
          streetLabel: "Rue de Rivoli",
          streetNumber: 101,
        }),
      });
      if (response.ok) {
        onFormSwitch("Home"); 
      } else {
        alert("Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion");
    }
    setLoading(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthdate(date);
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Inscription</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInputField
              placeholder="youremail@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Mot de passe</Text>
            <TextInputField
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.label}>Nom</Text>
            <TextInputField
              placeholder="Nom"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Prénom</Text>
            <TextInputField
              placeholder="Prénom"
              value={lastName}
              onChangeText={setLastName}
            />
            <Text style={styles.label}>Date de naissance</Text>
            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {birthdate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={birthdate}
              headerTextIOS="Choisir la date de naissance"
              confirmTextIOS="Confirmer"
              cancelTextIOS="Annuler"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Inscription</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onFormSwitch("Login")}>
            <Text style={styles.link}>Vous avez déjà un compte ? Connectez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.link}>Skip</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import TextInputField from '../components/TextInputField';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
import styles from '../styles/RegisterScreenStyles.jsx';
import { setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${API_URL}:3001/user/create`, {
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
          postalCode: 4200,
          streetLabel: "Rue de Rivoli",
          streetNumber: 101,
        }),
      });
      const userData = await response.json();
      if (response.ok) {
        AsyncStorage.setItem('tokenJWT', userData.token);
        dispatch(setUser(userData.user));
      } else {
        alert("Erreur lors de l'inscription: " + userData.code);
      }
    } catch (error) {
      alert("Erreur d'inscription");
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
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Vous avez déjà un compte ? Connectez-vous</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
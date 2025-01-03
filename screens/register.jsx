// register.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

function Register({ onFormSwitch, onSkip }) {
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
      const response = await fetch("http://localhost:3001/manager/user", {
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
          phone: "0123456789", // Ajoutez les autres champs nécessaires
          cityLabel: "Paris",
          postalCode: 75000,
          streetLabel: "Rue de Rivoli",
          streetNumber: 101,
        }),
      });
      if (response.ok) {
        onFormSwitch("Home"); // Rediriger vers la page d'accueil après une inscription réussie
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
    <View style={styles.container}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.header}>Inscription</Text>
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
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom"
            />
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Prénom"
            />
            <Text style={styles.label}>Date de naissance</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePickerButton}
            >
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
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Inscription</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onFormSwitch("Login")}>
            <Text style={styles.link}>
              Vous avez déjà un compte ? Connectez-vous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.link}>Skip</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Fond blanc
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },
  form: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  datePickerButton: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 14,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#28a745", // Couleur verte pour le bouton
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    color: "#28a745",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default Register;

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import TextInputField from '../components/TextInputField';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ProfileScreenStyles.jsx';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;

export default function ProfileScreen() {
  const tableComposantName = [
    {title: "Email", name: "email", imageSource: require("../images/profile.png"), changeAllowed: true},
    {title: "Nom", name: "firstname", imageSource: require("../images/profile.png")},
    {title: "Prénom", name: "lastname", imageSource: require("../images/profile.png")},
    {title: "Téléphone", name: "phone", imageSource: require("../images/phone.png")},
    {title: "Mot de passe", name: "password", imageSource: require("../images/password.png")},
    {title: "Nombre de points", name: "pointsNumber", imageSource: require("../images/number.png")},
    {title: "Date de naissance", name: "birthdate", isDate: true, imageSource: require("../images/birthday.png")},
    {title: "Adresse", name: "streetLabel", imageSource: require("../images/location.png")},
    {title: "Ville", name: "cityLabel", imageSource: require("../images/location.png")},
    {title: "Code postal", name: "postalCode", imageSource: require("../images/postalcode.png")},
    {title: "Numero", name: "streetNumber", imageSource: require("../images/number.png")}
  ];

  const [formUser, setFormUser] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [error, setError] = useState({});


  const getUser = async () => {    
    const response = await fetch(`http://${API_URL}:3001/v1/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
            console.log(response);          
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFormUser(data);  
      })
      .catch(error => {
        console.log(error);
        console.error("Error fetching user data:", error);
      });
  }

  useEffect(() => {
    getUser();
  }, []);
  
  

  const handleInputChange = (name, value) => {
    setFormUser({ ...formUser, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate && currentField) {
      // Formatage de la date pour correspondre au format attendu par l'API
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
      setFormUser(prevForm => ({
        ...prevForm,
        [currentField]: formattedDate
      }));
    if (selectedDate && currentField) {
      // Formatage de la date pour correspondre au format attendu par l'API
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
      setFormUser(prevForm => ({
        ...prevForm,
        [currentField]: formattedDate
      }));
    }
  };
}

  const submitForm = async () => {
    validate(formUser, setError);
     if(error?.noError){
        const token = await AsyncStorage.getItem('tokenJWT');
        await fetch(`http://${API_URL}:3001/v1/user/me${formUser?.password ? "" : "WithoutPassword"}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formUser)
        });
     }
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('tokenJWT', 'null');
    navigation.navigate('HomeScreen');
  };


const validate = (formUser = {}, setError) => {
  const errors = [];

  // Helpers
  const val = (k) => formUser?.[k];
  const isBlank = (v) => v == null || String(v).trim() === "";
  const digitsOnly = (v) => String(v ?? "").replace(/\D/g, "");
  const toInt = (v) => (Number.isFinite(Number(v)) ? parseInt(v, 10) : NaN);

  // Email (format + <=100)
  const email = val("email");
  if (isBlank(email) || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email invalide");
  else if (String(email).length > 100) errors.push("Email trop long (max 100)");

  // Nom / Prénom (requis + <=100)
  const firstname = val("firstname");
  if (isBlank(firstname)) errors.push("Nom manquant");
  else if (String(firstname).length > 100) errors.push("Nom trop long (max 100)");

  const lastname = val("lastname");
  if (isBlank(lastname)) errors.push("Prénom manquant");
  else if (String(lastname).length > 100) errors.push("Prénom trop long (max 100)");

  // Mot de passe (optionnel, si fourni then >=8)
  const password = val("password");
  if (password != null && String(password).length > 0 && String(password).length < 8) {
    errors.push("Mot de passe trop court (8 caractères minimum)");
  }

  // Date de naissance (valide, <= aujourd’hui, âge >= 12)
  const birthdate = val("birthdate");
  if (isBlank(birthdate) || isNaN(new Date(birthdate).getTime())) {
    errors.push("Date de naissance invalide");
  } else {
    const bd = new Date(birthdate); bd.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    if (bd > today) errors.push("La date de naissance ne peut pas être dans le futur");
    const age = today.getFullYear() - bd.getFullYear()
      - ((today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) ? 1 : 0);
    if (!isNaN(age) && age < 12) errors.push("Âge minimum 12 ans");
  }

  // Téléphone : exactement 10 chiffres
  const phone = digitsOnly(val("phone"));
  if (phone.length !== 10) errors.push("Numéro de téléphone invalide (10 chiffres requis)");

  // Ville / Adresse (requis + <=100)
  const cityLabel = val("cityLabel");
  if (isBlank(cityLabel)) errors.push("Ville manquante");
  else if (String(cityLabel).length > 100) errors.push("Ville trop longue (max 100)");

  const streetLabel = val("streetLabel");
  if (isBlank(streetLabel)) errors.push("Adresse manquante");
  else if (String(streetLabel).length > 100) errors.push("Adresse trop longue (max 100)");

  // Code postal : 4 chiffres
  const postalCode = String(val("postalCode") ?? "");
  if (!/^\d{4}$/.test(postalCode)) errors.push("Code postal invalide (4 chiffres)");

  // Numéro de rue : entier strictement > 0
  const streetNumber = toInt(val("streetNumber"));
  if (!Number.isInteger(streetNumber) || streetNumber <= 0) {
    errors.push("Numéro de rue invalide (> 0 requis)");
  }

  // Points (optionnel, mais entier si fourni)
  if (val("pointsNumber") !== undefined && !Number.isInteger(Number(val("pointsNumber")))) {
    errors.push("Nombre de points invalide (entier requis)");
  }

  setError({
    noError: errors.length === 0,
    errorText: errors.length ? errors.join(", ") : "Modificaiton efféctué"
  });
};


  


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.profileTitle}>Modifier vos données</Text>
      {tableComposantName.map(({ title, name, imageSource, isDate, changeAllowed }) => (
        <View key={name} style={styles.inputContainer}>
          <Text>{title} :</Text>
          {isDate ? (
            <>
              <View style={styles.dateButton}>
                <Button
                    color="#058C42"
                    title={new Date(formUser[name]).toLocaleDateString("fr-FR")}
                    onPress={() => {
                      setShowPicker(true);
                      setCurrentField(name);
                    }}
                  />
          
              </View>
              {showPicker && currentField === name && (
                <DateTimePicker
                  style={styles.dateTimePicker}
                  value={new Date(formUser[name])}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          ) : (
            <TextInputField
              placeholder={title}
              imageSource={imageSource}
              value={formUser[name]}
              onChangeText={(value) => handleInputChange(name, value)}
              changeAllowed={changeAllowed}
            />
          )}
        </View>
      ))}
      <Text>{error?.errorText}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Confirmer"
          color="#058C42"
          onPress={submitForm}
        />
      </View>
    </ScrollView>
  );
}


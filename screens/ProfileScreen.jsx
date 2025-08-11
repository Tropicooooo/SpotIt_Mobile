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



  const getUser = async () => {
    const token = await AsyncStorage.getItem('tokenJWT');
    const response = await fetch(`http://${API_URL}:3001/v1/user/me`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
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
    const token = await AsyncStorage.getItem('tokenJWT');
    await fetch(`http://${API_URL}:3001/v1/user/me${formUser?.password ? "" : "WithoutPassword"}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formUser)
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('tokenJWT', 'null');
    navigation.navigate('HomeScreen');
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
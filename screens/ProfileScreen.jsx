import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity } from 'react-native';
import TextInputField from '../components/TextInputField';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/ProfileScreenStyles.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const tableComposantName = [
    { title: "Email", name: "email", imageSource: require("../images/profile.png"), changeAllowed: true },
    { title: "Nom", name: "firstname", imageSource: require("../images/profile.png") },
    { title: "Prénom", name: "lastname", imageSource: require("../images/profile.png") },
    { title: "Téléphone", name: "phone", imageSource: require("../images/phone.png") },
    { title: "Mot de passe", name: "password", imageSource: require("../images/password.png") },
    { title: "Nombre de points", name: "pointsNumber", imageSource: require("../images/number.png") },
    { title: "Date de naissance", name: "birthdate", isDate: true, imageSource: require("../images/birthday.png") },
    { title: "Adresse", name: "streetLabel", imageSource: require("../images/location.png") },
    { title: "Ville", name: "cityLabel", imageSource: require("../images/location.png") },
    { title: "Code postal", name: "postalCode", imageSource: require("../images/postalcode.png") },
    { title: "Numero", name: "streetNumber", imageSource: require("../images/number.png") },
  ];

  const [formUser, setFormUser] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const getUser = async () => {
    const token = await AsyncStorage.getItem('tokenJWT');
    const response = await fetch('http://192.168.1.46:3001/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setFormUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleInputChange = (name, value) => {
    setFormUser({ ...formUser, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    const date = selectedDate || formUser[currentField];
    setShowPicker(false);
    if (currentField) {
      setFormUser({ ...formUser, [currentField]: date });
    }
  };

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('tokenJWT');
    await fetch(`http://192.168.1.46:3001/user/me${formUser?.password ? "" : "WithoutPassword"}`, {
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
                  title={formUser[name]?.toLocaleDateString("fr-FR")}
                  onPress={() => {
                    setShowPicker(true);
                    setCurrentField(name);
                  }}
                />
              </View>
              {showPicker && currentField === name && (
                <DateTimePicker
                  style={styles.dateTimePicker}
                  value={formUser[name]}
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
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

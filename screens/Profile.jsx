import React, { useState } from 'react';
import { StyleSheet, ScrollView , View, Text, Button } from 'react-native';
import TextInputField from '../components/TextInputField';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function Profile() {
    const tableComposantName = [
        {title: "Email", name: "email", imageSource: require("../images/profile.png"), changeAllowed  : true},
        {title: "Nom", name: "firstname", imageSource: require("../images/profile.png")},
        {title: "Prénom", name: "lastname", imageSource: require("../images/profile.png")},
        {title: "Téléphone", name: "phone", imageSource: require("../images/phone.png")},
        {title: "Mot de passe", name: "password", imageSource: require("../images/password.png")},
        {title: "Nombre de points", name: "pointsNumber", imageSource: require("../images/number.png")},
        {title: "Date de naissance", name: "birthdate", isDate: true, imageSource: require("../images/birthday.png")},
        {title: "Adresse", name: "streetLabel", imageSource: require("../images/location.png")},
        {title: "Ville", name: "cityLabel", imageSource: require("../images/location.png")},
        {title: "Code postal", name: "postalCode", imageSource: require("../images/postalcode.png")},
        {title: "Numero", name: "streetNumber", imageSource: require("../images/number.png")},
    ];

    const [formUser, setFormUser] = useState({});

    const [showPicker, setShowPicker] = useState(false);
    const [currentField, setCurrentField] = useState(null);

    const getUser = ()=>{
        fetch('http://localhost:3001/user/me', 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tokenJWT')}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("User data fetched:", data);
                setFormUser(data); // Mettre à jour l'état avec les données reçues
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }   

    //getUser();

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
    
      const submitForm = () => {
        fetch(`http://localhost:3001/user/me${(formUser?.password ? "" : "WithoutPassword")}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage?.getItem('tokenJWT')}`
            },
            body: JSON.stringify(currentUser)
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.profileTitle}>Modifier vos données</Text>
            {tableComposantName.map(({ title, name,imageSource, isDate, changeAllowed}) => (
                <View key={name} style={styles.inputContainer}>
                    <Text>{title} :</Text>
                    {isDate ?(
                        <>
                        <View  style={styles.dateButton}>
                            <Button
                                color="#058C42" 
                                title={formUser[name].toLocaleDateString("fr-FR")}
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
                      ):(
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
                    onPress={() => {
                        submitForm();
                    }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '90%',
        marginVertical: 10,
        alignSelf: 'center',
    },
    profileTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 40,
    },
    buttonContainer: {
        borderRadius: 25,
        backgroundColor: '#E8F5E9',
        overflow: 'hidden',
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    dateButton: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        fontWeight: 'bold',
      },
});

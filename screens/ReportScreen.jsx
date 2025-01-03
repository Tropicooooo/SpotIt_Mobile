import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import MapComponent from '../components/Map';
import * as Location from 'expo-location';
import colors from '../constants/colors';
import ProblemType from '../api/ProblemType';
import { reverseGeocode } from '../utils/utils';

import styles from '../styles/ReportScreenStyles.jsx';

const iconSize = 28;

export default function ReportScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');
  const [problemTypes, setProblemTypes] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (location) {
        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const { street, city, streetNumber, postalCode } = geocode[0];
          setAddress(`${street} ${streetNumber}, ${postalCode} ${city}`);
        }
      }
    };

    getLocation();
  }, []);

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleChoosePhoto = () => {
    const options = ['Choisir une image', 'Prendre une photo', 'Annuler'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          chooseImage();
        } else if (buttonIndex === 1) {
          takePhoto();
        }
      }
    );
  };

  const handleRectangleSelection = (index) => {
    const updatedChecked = {};
    problemTypes.forEach((_, idx) => {
      updatedChecked[idx] = false;
    });
    updatedChecked[index] = true;
    setChecked(updatedChecked);
  };

  const handleSubmit = async () => {
    if (!image) {
      console.log('Aucune image sélectionnée');
      return;
    }

    console.log('Tentative d\'envoi des données...');
    const formData = new FormData();

    formData.append('image', {
      uri: image,
      name: Date.now() + '.jpg',
      type: 'image/jpeg',
    });

    console.log('region', region);
    formData.append('description', description);
    formData.append('geocodedaddress', address);
    formData.append('userEmail', 'alice.smith@gmail.com');

    const selectedIndex = Object.keys(checked).find(key => checked[key]);
    if (selectedIndex) {
      const selectedProblemType = problemTypes[selectedIndex];
      formData.append('problemtypelabel', selectedProblemType.label);
    }

    formData.append('status', 'En attente');

    try {
      const response = await fetch('http://192.168.1.46:3001/report', {
        method: 'POST',
        body: formData,
      });

      console.log('Statut de réponse :', response.status);
    } catch (error) {
      console.error('Erreur d\'envoi des données', error);
    } finally {
      navigation.navigate('HomeScreen');
    }
  };

  const handleProblemTypesFetched = (data) => {
    setProblemTypes(data);
  };

  useEffect(() => {
    console.log(region);
  }, [region]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={iconSize} color={colors.primary} />
      </TouchableOpacity>

      {region && (
        <View style={styles.mapContainer}>
          <MapComponent
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            markers={[{
              coordinate: { latitude: 50.511916, longitude: 5.2406683 },
              type: 'Test',
              description: 'Marqueur de test',
              icon: 'location-outline',
            }]}
          />

          <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoButton}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="image-outline" size={60} color="green" />
            )}
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.inputGroup}>
          <Ionicons name="location-outline" size={24} color={colors.primary} />
          <Text style={styles.label}>Adresse</Text>
        </View>

        {address ? (
          <Text style={styles.text}>{address}</Text>
        ) : (
          <Text style={styles.text}>Chargement de l'adresse...</Text>
        )}

        <View style={styles.inputGroup}>
          <Ionicons name="warning-outline" size={24} color={colors.primary} />
          <Text style={styles.label}>Type</Text>
        </View>

        <ScrollView horizontal contentContainerStyle={styles.problemTypeContainer}>
          {problemTypes.map((type, index) => (
            <TouchableOpacity
              key={type.label}
              style={[
                styles.problemTypeButton,
                { backgroundColor: checked[index] ? colors.primary : colors.secondary },
              ]}
              onPress={() => handleRectangleSelection(index)}
            >
              <Ionicons
                name="trash-bin"
                size={iconSize}
                style={{
                  color: checked[index] ? colors.secondary : colors.primary,
                  marginBottom: 5,
                }}
              />
              <Text style={{ color: checked[index] ? colors.secondary : colors.primary }}>
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputGroup}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="green" />
          <Text style={styles.label}>Description</Text>
        </View>

        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Signaler le problème</Text>
        </TouchableOpacity>
      </ScrollView>

      <ProblemType onTypeFetched={handleProblemTypesFetched} />
    </View>
  );
}
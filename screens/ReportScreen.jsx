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
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
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

      return;
    }
    const formData = new FormData();

    formData.append('image', {
      uri: image,
      name: Date.now() + '.jpg',
      type: 'image/jpeg',
    });
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
      const response = await fetch(`http://${API_URL}:3001/v1/report`, {
        method: 'POST',
        body: formData,
      });

    } catch (error) {
      console.error('Erreur d\'envoi des données', error);
    } finally {
      navigation.navigate('HomeScreen');
    }
  };

  const handleProblemTypesFetched = (data) => {
    setProblemTypes(data);
  };
  return (
    <View style={styles.container}>
      {/* Bouton de retour */}
      <TouchableOpacity
        style={styles.backButton}
       onPress={() => navigation.navigate('HomeScreen')}

        
      >
        <Ionicons name="arrow-back-outline" size={iconSize} color={colors.primary} />
      </TouchableOpacity>

      {/* Affichage de la carte et du bouton pour choisir une image */}
      {region && (
        <View style={styles.mapWrapper}>
          <MapComponent
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={false}
            markers={[
              {
                coordinate: { latitude: 50.511916, longitude: 5.2406683 },
                type: 'Test',
                description: 'Marqueur de test',
                icon: 'location-outline',
              },
            ]}      

          />
          
          <TouchableOpacity style={styles.imageButton} onPress={handleChoosePhoto}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Ionicons name="image-outline" size={60} color="green" />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Contenu du formulaire */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.adresse}>
          <Ionicons name="location-outline" size={24} color={colors.primary} style={styles.iconSpacing} />
          <Text style={styles.labelText}>Adresse</Text>
        </View>

        {/* Affichage de l'adresse */}
        {address ? (
          <Text style={styles.addressText}>{address}</Text>
        ) : (
          <Text style={styles.addressText}>Chargement de l'adresse...</Text>
        )}

        {/* Type de problème */}
        <View style={styles.type}>
          <Ionicons name="warning-outline" size={24} color={colors.primary} style={styles.iconSpacing} />
          <Text style={styles.labelText}>Type</Text>
        </View>

        {/* Conteneur des types de problème */}
        <ScrollView
          style={styles.rectanglesContainer}
          horizontal
          contentContainerStyle={styles.rectanglesContent}
          showsHorizontalScrollIndicator={false}
        >
          {problemTypes.map((type, index) => (
            <TouchableOpacity
              key={type.label}  // Utilisation du label unique du type de problème
              style={[styles.rectangle, { backgroundColor: checked[index] ? colors.primary : colors.secondary }]}
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
              <Text
                style={[styles.rectangleText, { color: checked[index] ? colors.secondary : colors.primary }]}
              >
                {type.description} {/* Affichage du nom du type de problème */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Description du problème */}
        <View style={styles.descriptionContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="green" />
          <Text style={styles.labelText}>Description</Text>
        </View>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
        />

        {/* Bouton de signalement */}
        <TouchableOpacity style={styles.reportButton} onPress={handleSubmit}>
          <Text style={styles.reportButtonText}>Signaler le problème</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Récupération des types de problèmes */}
      <ProblemType onTypeFetched={handleProblemTypesFetched} />
    </View>
  );
}
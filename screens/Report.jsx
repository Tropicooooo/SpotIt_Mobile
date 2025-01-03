import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import MapComponent from '../components/Map';
import * as Location from 'expo-location';
import colors from '../constants/colors'; // Chemin vers le fichier de couleurs
import ProblemType from '../api/ProblemType';  // Import du composant qui récupère les types de problèmes
import { reverseGeocode } from '../utils/utils';  // Import de la fonction de géocodage inversé
const iconSize = 28;

export default function Report({ navigation }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');  // Nouvel état pour l'adresse
  const [problemTypes, setProblemTypes] = useState([]);  // État pour les types de problèmes
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

        // Obtenir l'adresse à partir des coordonnées GPS
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
    
    // Désélectionne tous les problèmes
    problemTypes.forEach((_, idx) => {
      updatedChecked[idx] = false;
    });
    
    // Sélectionne uniquement le problème sur l'index
    updatedChecked[index] = true;
  
    // Met à jour l'état avec le nouvel objet checked
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
      //fermer la page
      navigation.navigate('HomeScreen');
    }
  };
  
  
  
  
  

  // Cette fonction est appelée lorsque les types de problème sont récupérés
  const handleProblemTypesFetched = (data) => {
    setProblemTypes(data);
  };

  useEffect(() => {
    console.log(region);
  }, [region]);


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: '6%',
    left: '6%',
    padding: 10,
    zIndex: 20,
  },
  mapWrapper: {
    marginTop: '10%',
    height: '20%',
    paddingHorizontal: '4%',
    position: 'relative',
  },
  contentContainer: {
    padding: 20,
    paddingHorizontal: '8%',
  },
  imageButton: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    top: '80%',
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  type: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Réduction de l'espace
    marginTop: '5%',
  },
  adresse: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Réduction de l'espace
    marginTop: '30%',
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 5, // Réduction de l'espace entre l'icône et le texte
  },
  descriptionContainer: {
    flexDirection: 'row', // Aligner horizontalement
    alignItems: 'center', // Centrer verticalement
    marginBottom: 5, // Réduire l'espace sous l'icône
    marginTop: 10, // Réduire l'espace au-dessus
  },
  
  input: {
    height: 100,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rectanglesContainer: {
    maxHeight: 150,
    marginVertical: 10,
    marginTop: '8%',
  },
  rectanglesContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rectangle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  addressText: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 35, // Pour aligner le texte sous l'icône
  },
});


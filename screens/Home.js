import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider, FAB } from 'react-native-paper';
import MapComponent from '../components/Map';
import User from '../components/User';
import * as Location from 'expo-location';
import { fetchMarkers } from '../components/Report'; // Import de la fonction
import colors from '../constants/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function Home({ navigation }) {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userName, setUserName] = useState("Chargement...");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterType, setFilterType] = useState(null); // Filtre "Type de problème"
  const [filterStatus, setFilterStatus] = useState(null); // Filtre "Statut"
  const [tempEmergencyDegreeMin, setTempEmergencyDegreeMin] = useState(1); // Valeurs temporaires
  const [tempEmergencyDegreeMax, setTempEmergencyDegreeMax] = useState(5);
  const [emergencyDegreeMin, setEmergencyDegreeMin] = useState(1); // Importance minimale
  const [emergencyDegreeMax, setEmergencyDegreeMax] = useState(5); // Importance maximale

  const handleNameFetched = (name) => {
    setUserName(name);
  };

  // Récupération de la localisation de l'utilisateur
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      const userRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(userRegion);

      // Charger les marqueurs après avoir récupéré la localisation
      try {
        const data = await fetchMarkers({
          region: userRegion,
          filterType,
          filterStatus,
          emergencyDegreeMin,
          emergencyDegreeMax,
        });
        setMarkers(data);
        console.log("Marqueurs au lancement :", data);
      } catch (error) {
        console.error("Erreur lors de la récupération des marqueurs :", error);
      }
    };
    getLocation();
  }, [filterType, filterStatus, emergencyDegreeMin, emergencyDegreeMax]); // Ajouter les filtres pour les actualisations


  // Fonction pour actualiser les marqueurs
  const refreshMarkers = async () => {
    try {
      const data = await fetchMarkers({
        region: region,
        filterType,
        filterStatus,
        emergencyDegreeMin,
        emergencyDegreeMax,
      });

      setMarkers(data);
      console.log("Marqueurs mis à jour :", data);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des marqueurs :", error);
    }
  };

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };
  
  const handleApplyFilters = () => {
    setTempEmergencyDegreeMin(setTempEmergencyDegreeMin);
    setEmergencyDegreeMax(setTempEmergencyDegreeMax);
    setFilter(null); // Fermer le modal
    refreshMarkers(); // Actualiser les marqueurs avec les nouveaux filtres
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        {/* Barre supérieure */}
        <View style={styles.topBar}>
          <View style={styles.profileSection}>
            <User onNameFetched={handleNameFetched} />
            <Text style={styles.profileName}>{userName}</Text>
          </View>
          <Pressable style={styles.menuButton}>
            <Ionicons name="menu" size={30} color="green" onPress={() => setModalVisible(true)} />
          </Pressable>
        </View>
        {/* Carte */}
        <View style={styles.mapWrapper}>
          
         <MapComponent
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          markers={markers}
          scrollEnabled
          zoomEnabled
          rotateEnabled
          pitchEnabled
        />

           {/* Filtre de recherche */}
           <FAB.Group
                    open={isFabOpen}
                    icon={isFabOpen ? 'close' : 'filter-outline'}
                    actions={[
                      {
                        icon: 'format-list-bulleted',
                        label: 'Type',
                        onPress: () => setFilterType('ExampleType'), // Met à jour le filtre "Type"
                      },
                      {
                        icon: 'check-circle-outline',
                        label: 'Statut',
                        onPress: () => setFilterStatus('ExampleStatus'), // Met à jour le filtre "Statut"
                      },
                      {
                        icon: 'tune',
                        label: "Niveau d'importance",
                        onPress: () => setFilter("Niveau d'importance"), // Ouvre le modal pour le niveau d'importance
                      }            
                    ]}
                    onStateChange={({ open }) => setIsFabOpen(open)}
                    visible
                    color={"white"}
                    style={styles.fabContainer}
                    fabStyle={styles.fabGroup}
                  />
        </View>
         

        {/* Bouton de signalement */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('Report')}
        >
          <Text style={styles.reportButtonText}>Signaler un problème</Text>
        </TouchableOpacity>


        {/* filtre fab */}
        <Modal visible={filter === "Niveau d'importance"} transparent>
          <View style={styles.filtreLevel}>
            <Text style={styles.sliderLabel}>Sélectionne le niveau d'importance :</Text>
           <MultiSlider
            values={[tempEmergencyDegreeMin, tempEmergencyDegreeMax]} // Utilise les valeurs temporaires
            onValuesChange={(values) => {
              setEmergencyDegreeMin(values[0]);
              setEmergencyDegreeMax(values[1]);
            }}
            min={1}
            max={5}
            step={1}
            allowOverlap={false}
            snapped
            selectedStyle={{ backgroundColor: 'green' }}
            markerStyle={{ backgroundColor: 'green' }}
          />

          <TouchableOpacity
            style={styles.filtreLevelButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.filtreLevelButtonText}>Appliquer</Text>
          </TouchableOpacity>

          </View>
        </Modal>
        {/* Menu Modal */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>À propos</Text>
              <Text style={styles.modalText}>Contact</Text>
              <Text style={styles.modalText}>Déconnexion</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
       {/* Bouton d'actualisation */}
       <TouchableOpacity onPress={refreshMarkers} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Actualiser</Text>
        </TouchableOpacity>

    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapWrapper: { height: '88%', paddingHorizontal: '4%', position: 'relative' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  profileSection: { 
    flexDirection: 'row', 
    alignItems: 'center' }
    ,
  profileName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'green' },
  menuButton: { 
    padding: 10,
     color: 'green' 
    },
  reportButton: {
    position: 'absolute',
    bottom: '3%',
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
  },
  reportButtonText: {
     color: '#fff', fontSize: 24, 
     fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    bottom: '15%',
    right: '5%',
  },
  fabGroup: {
    backgroundColor: colors.primary,

  },
  filtreLevel: {

    backgroundColor: 'white',
    color: 'green',
    left: '5%',
    right: '5%',
    alignItems: 'center',
    paddingHorizontal: '4%', 
    position: 'absolute',
    borderRadius: 10,
    elevation: 5,
    top: '40%',
  },
  filtreLevelButton: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
    top: '150%',
  },
  filtreLevelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

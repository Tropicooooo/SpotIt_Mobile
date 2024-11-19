import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider, FAB } from 'react-native-paper';
import MapComponent from '../components/Map';
import { Dimensions } from 'react-native';
import User from "../components/User";
import Reports from '../components/Report';
import * as Location from 'expo-location';
import colors from '../constants/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');
const iconSize = 30;

export default function Home({ navigation }) {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userName, setUserName] = useState("Chargement...");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterType, setFilterType] = useState(null); // Pour le filtre "Type de problème"
  const [filterStatus, setFilterStatus] = useState(null); // Pour le filtre "Statut"
  const [importanceMin, setImportanceMin] = useState(1); // Pour l'importance minimale
  const [importanceMax, setImportanceMax] = useState(5); // Pour l'importance maximale


  const handleNameFetched = (name) => {
    setUserName(name);
  };

  useEffect(() => {
    // Logique de filtrage basée sur les filtres actifs
    const filteredMarkers = markers.filter(marker => {
      const matchesType = filterType ? marker.type === filterType : true;
      const matchesStatus = filterStatus ? marker.status === filterStatus : true;
      const matchesImportance =
        marker.importance >= importanceMin && marker.importance <= importanceMax;
  
      return matchesType && matchesStatus && matchesImportance;
    });
  
    setMarkers(filteredMarkers);
  }, [filterType, filterStatus, importanceMin, importanceMax]);
  

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
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };
    getLocation();
  }, []);

  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
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
        <View style={styles.topBar}>
          {/* Profil */}

          <View style={styles.profileSection}>
            <User onNameFetched={handleNameFetched} />
            <Text style={styles.profileName}>{userName}</Text>
          </View>

          {/* Menu */}
          <Pressable style={styles.menuButton}>
            <Ionicons name="menu" size={iconSize} color="green" onPress={() => setModalVisible(true)} />
          </Pressable>
        </View>

        {/* Carte */}
        <View style={styles.mapWrapper}>

          <MapComponent
            region={region}
            markers={markers}
            onRegionChangeComplete={onRegionChangeComplete}
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
          
          {/* Récupération des signalements */}
        <Reports
          region={region}
          onReportsFetched={(data) => {
            setMarkers(data);
          }}
        />

        {/* Bouton de signalement */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('Report')}
        >
          <Text style={styles.reportButtonText}>Signaler un problème</Text>
        </TouchableOpacity>
      </View>

      {/* filtre fab */}
      <Modal visible={filter === "Niveau d'importance"} transparent>
        <View style={styles.filtreLevel}>
          <Text style={styles.sliderLabel}>Sélectionne le niveau d'importance :</Text>
          <MultiSlider
            values={[importanceMin, importanceMax]} // Valeurs actuelles
            onValuesChange={(values) => {
              setImportanceMin(values[0]);
              setImportanceMax(values[1]);
            }} // Met à jour les valeurs
            min={1} // Valeur minimale
            max={5} // Valeur maximale
            step={1} // Incrémentation par pas de 1
            allowOverlap={false} // Empêche le chevauchement des curseurs
            snapped // Les curseurs s'alignent sur les valeurs entières
            selectedStyle={{ backgroundColor: 'green' }} // Style de la barre sélectionnée
            markerStyle={{ backgroundColor: 'green' }} // Style des curseurs
          />
          <TouchableOpacity
          style={styles.filtreLevelButton}
          onPress={() => setFilter(null)}
          >
          <Text style={styles.filtreLevelButtonText}>Appliquer</Text>
        </TouchableOpacity>
        </View>
      </Modal>

      {/* Menu option */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>A propos</Text>
            <Text style={styles.modalText}>Contact</Text>
            <Text style={styles.modalText}>Déconnexion</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Provider>
  );
}

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

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider, FAB } from 'react-native-paper';
import MapComponent from '../components/Map';
import User from '../api/User';
import * as Location from 'expo-location';
import { fetchMarkers } from '../api/Report'; // Import de la fonction
import colors from '../constants/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ProblemType from '../api/ProblemType';  // Import du composant qui récupère les types de problèmes

export default function Home({ navigation }) {
  const mapRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userName, setUserName] = useState("Chargement...");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterType, setFilterType] = useState([]); // Filtre "Type de problème"
  const [filterStatus, setFilterStatus] = useState(["1","2"]); // Filtre "Statut" avec tout selectionné par défaut
  const [tempEmergencyDegreeMin, setTempEmergencyDegreeMin] = useState(1); // Valeurs temporaires
  const [tempEmergencyDegreeMax, setTempEmergencyDegreeMax] = useState(5);
  const [emergencyDegreeMin, setEmergencyDegreeMin] = useState(1); // Importance minimale
  const [emergencyDegreeMax, setEmergencyDegreeMax] = useState(5); // Importance maximale
  const [checked, setChecked] = useState({});

  const iconSize = 28;

  const status = [
    { id: '1', name: 'En attente' },
    { id: '2', name: 'En cours' },
    { id: '3', name: 'Résolu' },
  ];

  const handleNameFetched = (name) => {
    setUserName(name);
  };

  const getStatusNames = (ids) => {
    return ids
      .map(id => status.find(status => status.id === id)?.name)
      .filter(name => name); // Filtrer les valeurs undefined
  };

  const getTypesLabels = (types) => {
    return types
    .filter((_, index) => checked[index]) // Filtre uniquement les types sélectionnés
    .map((type) => type.label); // Extrait les labels des types sélectionnés
  };


  const toggleSelectionFilterStatus = (id) => {
    setFilterStatus((prevStatus) => {
      const updatedStatus = prevStatus.includes(id)
        ? prevStatus.filter((item) => item !== id) // Déselectionner
        : [...prevStatus, id]; // Sélectionner
  
      console.log("Statuts sélectionnés :", updatedStatus);
      return updatedStatus;
    });
  };
  

  const renderStatus = ({ item }) => {
    const isSelected = filterStatus.includes(item.id); // Vérifie si l'élément est sélectionné
  
    return (
      <TouchableOpacity
        onPress={() => toggleSelectionFilterStatus(item.id)} // Gère la sélection/désélection
        style={[
          styles.item, // Style par défaut
          isSelected && styles.selectedItem, // Applique un style différent si sélectionné
        ]}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
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
      const statusNames = getStatusNames(filterStatus);
      const typesLabels = getTypesLabels(filterType);
      try {
        const data = await fetchMarkers({
          region: userRegion,
          filterType : typesLabels,
          filterStatus: statusNames,
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
    const statusNames = getStatusNames(filterStatus);
    const typesLabels = getTypesLabels(filterType);
    try {
      const data = await fetchMarkers({
        region: region,
        filterType : typesLabels,
        filterStatus: statusNames,
        emergencyDegreeMin,
        emergencyDegreeMax,
      });

      setMarkers(data);
      console.log("Marqueurs mis à jour :", data);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des marqueurs :", error);
    }
  };

  //const handleRegionChangeComplete = (newRegion) => {
   //  console.log("Nouvelle région :", newRegion);
   //  setRegion(newRegion);
   //};
  
   const handleApplyFilters = () => {
    setEmergencyDegreeMin(tempEmergencyDegreeMin);
    setEmergencyDegreeMax(tempEmergencyDegreeMax);
  
    // Récupérer les types sélectionnés
    const selectedTypes = getSelectedTypes();
    setFilterType(selectedTypes);
  
    setFilter(null); // Fermer le modal
    setTimeout(() => refreshMarkers(), 0);
  };
  

  const [isAnimating, setIsAnimating] = useState(false);

  const handleRectangleSelection = (index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index], // Bascule entre sélectionné et non sélectionné
    }));
  };

  const getSelectedTypes = () => {
    return filterType.filter((_, index) => checked[index]);
  };
  

const resetLocation = async () => {
  if (isAnimating) return; // Empêche d'exécuter une nouvelle animation

  setIsAnimating(true); // Démarre l'animation
  try {
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = location.coords;
    const userRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(userRegion, 1000); // Anime la carte
    }
    setRegion(userRegion);
  } catch (error) {
    console.error("Erreur lors de la réinitialisation de la position :", error);
  } finally {
    setTimeout(() => setIsAnimating(false), 1000); // Laisse un délai avant de réactiver
  }
};

// Cette fonction est appelée lorsque les types de problème sont récupérés
const handleProblemTypesFetched = (data) => {
  if (JSON.stringify(filterType) !== JSON.stringify(data)) {
    setFilterType(data);
  }
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
          ref={mapRef}
          //onRegionChangeComplete={handleRegionChangeComplete}
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
                        onPress: () => setFilter('Type'), // Met à jour le filtre "Type"
                      },
                      {
                        icon: 'check-circle-outline',
                        label: 'Statut',
                        onPress: () => setFilter("Statut"), // Ouvre le modal pour le statut
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


        {/* filtre niveau d'importance */}
        <Modal visible={filter === "Niveau d'importance"} transparent>
          <View style={styles.filtreLevel}>
            <Text style={styles.sliderLabel}>Sélectionne le niveau d'importance :</Text>
           <MultiSlider
            values={[tempEmergencyDegreeMin, tempEmergencyDegreeMax]} // Utilise les valeurs temporaires
            onValuesChange={(values) => {
              setTempEmergencyDegreeMin(values[0]);
              setTempEmergencyDegreeMax(values[1]);
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

        {/* filtre status */}
        <Modal visible={filter === "Statut"} transparent>
          <View style={styles.filtreStatut}>
            <Text style={styles.filtreStatutLabel}>Sélectionne le ou les status</Text>
            <FlatList
              data={status}
              keyExtractor={(item) => item.id}
              renderItem={renderStatus}
            />
            <TouchableOpacity
              style={styles.filtreStatutButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.filtreStatutButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        {/* filtre type */}
        <Modal visible={filter === "Type"} transparent>
          <ProblemType onTypeFetched={handleProblemTypesFetched} />
          {/* Récupération des types de problèmes */}
          <View style={styles.filtreStatut}>
            <Text style={styles.filtreStatutLabel}>Sélectionne le ou les types</Text>
            <ScrollView
              style={styles.rectanglesContainer}
              horizontal
              contentContainerStyle={styles.rectanglesContent}
              showsHorizontalScrollIndicator={false}
            >
              {filterType.map((type, index) => (
                <TouchableOpacity
                  key={type.label}
                  style={[
                    styles.rectangle,
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
                  <Text
                    style={[
                      styles.rectangleText,
                      { color: checked[index] ? colors.secondary : colors.primary },
                    ]}
                  >
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}

            </ScrollView>
            <TouchableOpacity
              style={styles.filtreStatutButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.filtreStatutButtonText}>Appliquer</Text>
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
          <Text style={styles.refreshMarkersButtonText}>Actualiser</Text>
        </TouchableOpacity>

          {/* Bouton Recentrer */}
      <TouchableOpacity onPress={resetLocation} style={[styles.resetLocationButton, styles.shadow]}>
        <Text style={styles.resetLocationButtonText}>Recentrer</Text>
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
  sliderLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  filtreStatut: {
    backgroundColor: 'white',
    left: '5%',
    right: '5%',
    alignItems: 'center',
    paddingHorizontal: '4%',
    position: 'absolute',
    borderRadius: 10,
    elevation: 5,
    top: '40%',
  },
  filtreStatutLabel: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10,
  },
  filtreStatutText: {
    fontSize: 16,
    color: colors.primary,
    marginVertical: 5,
  },
  filtreStatutButton: {
    backgroundColor: 'green',
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  filtreStatutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  filtreImportanceModal: {
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
  filtreImportanceButton: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
    top: '150%',
  },
  filtreImportanceButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  sliderLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },

  // Style pour le modal de sélection du statut
  filtreStatutModal: {
    backgroundColor: 'white',
    left: '5%',
    right: '5%',
    alignItems: 'center',
    paddingHorizontal: '4%',
    position: 'absolute',
    borderRadius: 10,
    elevation: 5,
    top: '40%',
  },
  filtreStatutLabel: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10,
  },
  filtreStatutText: {
    fontSize: 16,
    color: colors.primary,
    marginVertical: 5,
  },
  filtreStatutButton: {
    backgroundColor: 'green',
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  filtreStatutButtonText: {
    color: '#fff',
    fontSize: 18,
  },

  // Styles pour la sélection des statuts
  selectedItem: {
    backgroundColor: 'green', // Couleur de fond quand l'élément est sélectionné
    borderColor: 'green',
    borderWidth: 1,
  },
  item: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey', 
    marginVertical: 5,
  },
  itemText: {
    color: 'black', 
  },
  selectedItemText: {
    color: 'white',
  },
});

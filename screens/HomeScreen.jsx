import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Alert,
  Platform,
  PermissionsAndroid,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider, FAB } from "react-native-paper";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as Location from "expo-location";

import { fetchMarkers } from "../api/Report.jsx";
import MapComponent from "../components/Map.jsx";
import User from "../api/User.jsx";
import ProblemType from "../api/ProblemType.jsx";
import colors from "../constants/colors.js";
import styles from "../styles/HomeScreenStyles.jsx";

export default function HomeScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);
  const [prevRegion, setPrevRegion] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const [emergencyDegreeMin, setEmergencyDegreeMin] = useState(1);
  const [emergencyDegreeMax, setEmergencyDegreeMax] = useState(5);
  const [filterType, setFilterType] = useState([]);
  const [filterStatus, setFilterStatus] = useState(["1", "2"]);
  const [userName, setUserName] = useState("Chargement...");
  const [modalOptionVisible, setModalOptionVisible] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [tempEmergencyDegreeMin, setTempEmergencyDegreeMin] = useState(1); // Valeurs temporaires
  const [tempEmergencyDegreeMax, setTempEmergencyDegreeMax] = useState(5);
  const [checked, setChecked] = useState({});

  const iconSize = 28;

  const status = [
    { id: "1", name: "En attente" },
    { id: "2", name: "En cours" },
    { id: "3", name: "Résolu" },
  ];

  const handleNameFetched = (name) => {
    setUserName(name);
  };

  const getStatusNames = (ids) => {
    if (!ids || ids.length === 0) {
      return "";
    }
    return ids
      .map((id) => status.find((status) => status.id === id)?.name)
      .filter((name) => name);
  };

  const getTypesLabels = (types) => {
    const selectedTypes = types.filter((_, index) => checked[index]);
    if (selectedTypes.length === 0) {
      return "";
    }
    return selectedTypes.map((type) => type.label);
  };

  // Fonction pour actualiser les marqueurs recois en parametre newRegion
  const refreshMarkers = async () => {
    const statusNames = getStatusNames(filterStatus);
    const typesLabels = getTypesLabels(filterType);

    try {
      const data = await fetchMarkers({
        region: region,
        filterType: typesLabels || "", // Utiliser "" si typesLabels est vide
        filterStatus: statusNames || "", // Utiliser "" si statusNames est vide
        emergencyDegreeMin,
        emergencyDegreeMax,
      });

      setMarkers(data);
      console.log("Marqueurs mis à jour :", data);
    } catch (error) {
      //console.error("Erreur lors de l'actualisation des marqueurs :", error);
    }
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

  const toggleSelectionFilterStatus = (id) => {
    setFilterStatus((prevStatus) => {
      const updatedStatus = prevStatus.includes(id)
        ? prevStatus.filter((item) => item !== id) // Déselectionner
        : [...prevStatus, id]; // Sélectionner

      //console.log("Statuts sélectionnés :", updatedStatus);
      return updatedStatus;
    });
  };


  const handleApplyFilters = () => {
    setEmergencyDegreeMin(tempEmergencyDegreeMin);
    setEmergencyDegreeMax(tempEmergencyDegreeMax);

    // Récupérer les types sélectionnés
    const selectedTypes = getSelectedTypes();
    setFilterType(selectedTypes);

    setFilter(null); // Fermer le modal
    setTimeout(() => refreshMarkers(), 0);
  };

  const handleRectangleSelection = (index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index], // Bascule entre sélectionné et non sélectionné
    }));
  };

  const getSelectedTypes = () => {
    return filterType.filter((_, index) => checked[index]);
  };

  useEffect(() => {
    if (region) {
      //console.log("Region changed :", region);
      refreshMarkers();
    } else {
      //console.warn("Region is null, skipping refreshMarkers.");
    }
  }, [region]);


  const getCurrentLocation = async () => {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission de localisation refusée");
      setLoading(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion); // Met à jour l'état region
      //console.log("Localisation actuelle :", newRegion);
    } catch (error) {
      //console.error("Erreur lors de la récupération de la localisation");
      
    } finally {
      setLoading(false);
      //console.log("Region marker :", region);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to show your current location on the map."
            );
            setLoading(false);
          }
        } catch (err) {
          //console.warn(err);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const handleProblemTypesFetched = (data) => {
    if (JSON.stringify(filterType) !== JSON.stringify(data)) {
      setFilterType(data);
    }
  };

  const handleRegionChangeComplete = useCallback((newRegion) => {
    //n console.log("Nouvelle région :", newRegion);
    //console.log("region latitude :", newRegion.latitude);
    //console.log("region longitude :", newRegion.longitude);
    //console.log("region prevRegion :", prevRegion);
    if (newRegion && newRegion.latitude && newRegion.longitude) {
      // Comparez la nouvelle région avec la région précédente
      if (
        newRegion.latitude !== prevRegion.latitude ||
        newRegion.longitude !== prevRegion.longitude
      ) {
        setRegion(newRegion); // Mettez à jour l'état seulement si la région a changé
        setPrevRegion(newRegion); // Mettez à jour l'ancienne région
      }
    } else {
      //console.warn("newRegion is invalid", newRegion); // Avertissement si newRegion est invalide
    }
  }, [prevRegion]); // Dépend de prevRegion
  
  



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
            <Ionicons
              name="menu"
              size={30}
              color="green"
              onPress={() => setModalOptionVisible(true)}
            />
          </Pressable>
        </View>
        <View style={styles.mapWrapper}>
          {/* Map */}
          <MapComponent
            markers={markers} 
            loading={loading} 
            onRegionChangeComplete={handleRegionChangeComplete}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            navigation={navigation}
          >
    
          </MapComponent>

          {/* Filtre de recherche */}
          <FAB.Group
            open={isFabOpen}
            icon={isFabOpen ? "close" : "filter-outline"}
            actions={[
              {
                icon: "format-list-bulleted",
                label: "Type",
                onPress: () => setFilter("Type"), // Met à jour le filtre "Type"
              },
              {
                icon: "check-circle-outline",
                label: "Statut",
                onPress: () => setFilter("Statut"), // Ouvre le modal pour le statut
              },
              {
                icon: "tune",
                label: "Niveau d'importance",
                onPress: () => setFilter("Niveau d'importance"), // Ouvre le modal pour le niveau d'importance
              },
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
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.reportButtonText}>Signaler un problème</Text>
        </TouchableOpacity>

        {/* filtre niveau d'importance */}
        <Modal visible={filter === "Niveau d'importance"} transparent>
          <View style={styles.filtreLevel}>
            <Text style={styles.sliderLabel}>
              Sélectionne le niveau d'importance :
            </Text>
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
              selectedStyle={{ backgroundColor: "green" }}
              markerStyle={{ backgroundColor: "green" }}
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
            <Text style={styles.filtreStatutLabel}>
              Sélectionne le ou les status
            </Text>
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
            <Text style={styles.filtreStatutLabel}>
              Sélectionne le ou les types
            </Text>
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
                    {
                      backgroundColor: checked[index]
                        ? colors.primary
                        : colors.secondary,
                    },
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
                      {
                        color: checked[index]
                          ? colors.secondary
                          : colors.primary,
                      },
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
        {/* Menu Option */}
        <Modal
          transparent
          visible={modalOptionVisible}
          animationType="slide"
          onRequestClose={() => setModalOptionVisible(false)}
        >
          <View style={styles.modalOptionContainer}>
            <View style={styles.modalOptionContent}>
              <Text style={styles.modalOptionText}>À propos</Text>
              <Text style={styles.modalOptionText}>Contact</Text>
              <Text style={styles.modalOptionText}>Déconnexion</Text>
              <TouchableOpacity
                onPress={() => setModalOptionVisible(false)}
                style={styles.modalOptioncloseButton}
              >
                <Text style={styles.modalOptioncloseButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

    </Provider>
  );
}
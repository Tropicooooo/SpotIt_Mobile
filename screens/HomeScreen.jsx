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
import colors from "../constants/colors.jsx";
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
  const [tempEmergencyDegreeMin, setTempEmergencyDegreeMin] = useState(1);
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

  const getStatusNames = (ids) =>
    ids?.length
      ? ids.map((id) => status.find((status) => status.id === id)?.name).filter(Boolean)
      : "";

  const getTypesLabels = (types) =>
    types.filter((_, index) => checked[index]).map((type) => type.label);

  const refreshMarkers = async () => {
    try {
      const data = await fetchMarkers({
        region,
        filterType: getTypesLabels(filterType) || "",
        filterStatus: getStatusNames(filterStatus) || "",
        emergencyDegreeMin,
        emergencyDegreeMax,
      });
      setMarkers(data);
      console.log("Marqueurs mis à jour :", data);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des marqueurs :", error);
    }
  };

  const toggleSelectionFilterStatus = (id) => {
    setFilterStatus((prevStatus) =>
      prevStatus.includes(id)
        ? prevStatus.filter((item) => item !== id)
        : [...prevStatus, id]
    );
  };

  const handleApplyFilters = () => {
    setEmergencyDegreeMin(tempEmergencyDegreeMin);
    setEmergencyDegreeMax(tempEmergencyDegreeMax);
    setFilterType(getSelectedTypes());
    setFilter(null);
    setTimeout(refreshMarkers, 0);
  };

  const handleRectangleSelection = (index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index],
    }));
  };

  const getSelectedTypes = () => filterType.filter((_, index) => checked[index]);

  useEffect(() => {
    if (region) refreshMarkers();
    else console.warn("Region is null, skipping refreshMarkers.");
  }, [region]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Localisation requise pour continuer.");
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Erreur localisation", error);
    } finally {
      setLoading(false);
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
              "Permission refusée",
              "Localisation requise pour voir votre position sur la carte."
            );
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };
    requestLocationPermission();
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion) => {
    if (newRegion?.latitude && newRegion?.longitude) {
      if (
        newRegion.latitude !== prevRegion.latitude ||
        newRegion.longitude !== prevRegion.longitude
      ) {
        setRegion(newRegion);
        setPrevRegion(newRegion);
      }
    } else {
      console.warn("newRegion is invalid", newRegion);
    }
  }, [prevRegion]);

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.profileSection}>
            <User onNameFetched={handleNameFetched} />
            <Text style={styles.profileName}>{userName}</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={() => setModalOptionVisible(true)}>
            <Ionicons name="menu" size={30} color="green" />
          </Pressable>
        </View>
        <View style={styles.mapWrapper}>
          <MapComponent
            markers={markers}
            loading={loading}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton
            navigation={navigation}
          />
          <FAB.Group
            open={isFabOpen}
            icon={isFabOpen ? "close" : "filter-outline"}
            actions={[
              { icon: "format-list-bulleted", label: "Type", onPress: () => setFilter("Type") },
              { icon: "check-circle-outline", label: "Statut", onPress: () => setFilter("Statut") },
              { icon: "tune", label: "Niveau d'importance", onPress: () => setFilter("Niveau d'importance") },
            ]}
            onStateChange={({ open }) => setIsFabOpen(open)}
            visible
            color="white"
            style={styles.fabContainer}
            fabStyle={styles.fabGroup}
          />
        </View>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.reportButtonText}>Signaler un problème</Text>
        </TouchableOpacity>
        <Modal visible={filter === "Niveau d'importance"} transparent>
          <View style={styles.filtreLevel}>
            <Text style={styles.sliderLabel}>Sélectionne le niveau d'importance :</Text>
            <MultiSlider
              values={[tempEmergencyDegreeMin, tempEmergencyDegreeMax]}
              onValuesChange={([min, max]) => {
                setTempEmergencyDegreeMin(min);
                setTempEmergencyDegreeMax(max);
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
        {/* Other modals */}
      </View>
    </Provider>
  );
}
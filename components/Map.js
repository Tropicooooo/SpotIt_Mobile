import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Provider, FAB } from "react-native-paper";
import * as Location from "expo-location"; // Assurez-vous d'importer Location

const MapComponent = ({ markers, loading, onRegionChangeComplete }) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null); // Initialisation de la region
  const [prevRegion, setPrevRegion] = useState(null); // Si vous avez besoin de gérer la région précédente
  const [errorMsg, setErrorMsg] = useState(null); // Pour les erreurs de permission
  const [isLoading, setLoading] = useState(false);

  const defaultMapStyle = [
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  // Fonction pour récupérer la position actuelle
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
      setRegion(newRegion); // Met à jour l'état region avec la position actuelle
      console.log("Localisation actuelle :", newRegion);
    } catch (error) {
      console.error("Erreur lors de la récupération de la localisation");
      setLoading(false);
    }
  };

  // Vérification et demande de permission de localisation
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
          console.warn(err);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  // Center the map when the region changes
  useEffect(() => {
    if (region && mapRef.current) {
      const currentRegion = mapRef.current.props.region;
      if (currentRegion && (currentRegion.latitude !== region.latitude || currentRegion.longitude !== region.longitude)) {
        mapRef.current.animateToRegion(region, 1);
      }
    }
  }, [region]);

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <Provider>
          <MapView
            ref={mapRef} // Référence à la carte pour un contrôle manuel
            style={styles.map}
            region={region} // Utilisation de la région initiale (localisation actuelle)
            showsUserLocation={true}
            showsMyLocationButton={true}
            customMapStyle={defaultMapStyle}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
                onPress={() => console.log(`Marker pressé :`, marker)}
              >
                <Ionicons name="location-sharp" size={35} color="green" />
              </Marker>
            ))}
          </MapView>
        </Provider>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapComponent;

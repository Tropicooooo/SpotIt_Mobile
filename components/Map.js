import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Platform, Alert, ActivityIndicator, PermissionsAndroid, Modal, Text,TouchableOpacity, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-native-paper";
import * as Location from "expo-location";
import colors from "../constants/colors";

const MapComponent = ({ markers, loading, onRegionChangeComplete, scrollEnabled, zoomEnabled, rotateEnabled, pitchEnabled, showsUserLocation, showsMyLocationButton, navigation}) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null); 
  const [errorMsg, setErrorMsg] = useState(null); 
  const [isLoading, setLoading] = useState(false);
  const [reportInfoModal, setReportInfoModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
      setRegion(newRegion);
    } catch (error) {
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
              "Permission Denied",
              "Location permission is required to show your current location on the map."
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

  useEffect(() => {
    if (region && mapRef.current) {
      const currentRegion = mapRef.current.props.region;
      if (currentRegion && (currentRegion.latitude !== region.latitude || currentRegion.longitude !== region.longitude)) {
        mapRef.current.animateToRegion(region, 1);
      }
    }
  }, [region]);

  const openReportModal = (marker) => {
    console.log(marker);
    setSelectedMarker(marker);

    setReportInfoModal(true);
  };

  const closeReportModal = () => {
    setReportInfoModal(false);
    setSelectedMarker(null);
  };

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <Provider>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            showsUserLocation={showsUserLocation}
            showsMyLocationButton={showsMyLocationButton}
            customMapStyle={defaultMapStyle}
            scrollEnabled={scrollEnabled}
            zoomEnabled={zoomEnabled}
            rotateEnabled={rotateEnabled}
            pitchEnabled={pitchEnabled}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
                onPress={() => { openReportModal(marker); }}
              >
                <Ionicons name="location-sharp" size={35} color="green" />
              </Marker>
            ))}     
          </MapView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={reportInfoModal}
            onRequestClose={closeReportModal}
          >
            <View style={styles.modalContainer}>
              
              <View style={styles.modalCard}>
                {/* Image */}
                {selectedMarker && (
                  <Image
                    source={{ uri: "http://192.168.1.46:3001" + selectedMarker?.picture }}
                    style={styles.modalImage}
                  />
                  
                )}
                <View style={styles.modalButton}>
                  {/* Bouton info report */}

                  <TouchableOpacity onPress={() => navigation.navigate("ReportInfo", { selectedMarker })}  style={styles.closeIcon}>
                      <Ionicons name="information-outline" size={20} color={colors.primary } />
                    </TouchableOpacity>

                    {/* Bouton de fermeture */}
                    <TouchableOpacity onPress={closeReportModal} style={styles.openIcon}>
                      <Ionicons name="close" size={20} color={colors.primary } />
                    </TouchableOpacity>
                </View>
                {/* Texte et Bouton */}
                <View style={styles.modalFooter}>
                  <Text style={styles.modalTitleProblemType}>{selectedMarker?.problemtypedescription}</Text>
                  <Text style={styles.modalTitleReportDate}>{selectedMarker?.reportdate}</Text>
                  <Text style={styles.modalTitleStatus}>{selectedMarker?.status}</Text>
                </View>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    top: "15%",
    bottom: "8%",
    paddingHorizontal: "4%",
  },
  
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    height: '50%', // Ajustez selon la taille souhaitée
    width: '100%',
  },
  
  modalImage: {
    width: '100%',
    height: '50%', // L'image occupe 70% de la carte
    resizeMode: 'cover',
  },
  
  modalFooter: {
    padding: 15,
    justifyContent: 'space-between',
  },
  
  modalTitleProblemType: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  modalTitleReportDate: {
    fontSize: 16,
    fontWeight: '600',
    color: 'grey',
  },
  modalTitleStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10, // Assure que les boutons restent au-dessus de l'image
  },
  
  closeIcon: {
    marginRight: 10, 
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  
  openIcon: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  
});

export default MapComponent;

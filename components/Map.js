import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Platform, Alert, ActivityIndicator, PermissionsAndroid, Modal, Text,TouchableOpacity, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-native-paper";
import * as Location from "expo-location";

const MapComponent = ({ markers, loading, onRegionChangeComplete, scrollEnabled, zoomEnabled, rotateEnabled, pitchEnabled, showsUserLocation, showsMyLocationButton}) => {
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
    console.log(marker.picture);
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Information</Text>
            {selectedMarker && (
              <Text style={styles.modalText}>
                {selectedMarker.description}
              </Text>
            )}
               <Image source={{uri: "http://192.168.1.46:3001" + selectedMarker?.picture}} style={styles.modalImage} />

            <TouchableOpacity onPress={closeReportModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  calloutContainer: {
    minWidth: 150,
    minHeight: 50,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  calloutText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    bottom: "8%",
    paddingHorizontal: "4%",
    
  },
  modalContent: {
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 25,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapComponent;

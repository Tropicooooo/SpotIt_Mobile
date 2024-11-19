import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const MapComponent = ({ region, markers, onRegionChangeComplete, ...props }) => {
  
  const defaultMapStyle = [
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off" // Désactive les points d'intérêt (POI)
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off" // Désactive les labels des points d'intérêt
        }
      ]
    }
  ];

  return (
    <View style={styles.mapContainer}>
      <MapView
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        style={styles.map}
        customMapStyle={defaultMapStyle}
        {...props}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
          >
            <Ionicons 
              name="location-sharp" 
              size={35} 
              color="green" 
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: 20, 
    overflow: 'hidden', 
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    padding: 10,
    width: 150,
    minWidth: 120,
  },
  reportText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportDate: {
    fontStyle: 'italic',
    color: '#555',
  },
});

export default MapComponent;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const MapComponent = React.forwardRef(({ region, markers, onRegionChangeComplete, ...props }, ref) => {
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
        ref={ref} // Transmettez la référence ici
        style={styles.map}
        customMapStyle={defaultMapStyle}
        onRegionChangeComplete={onRegionChangeComplete}
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
});

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
});

export default MapComponent;

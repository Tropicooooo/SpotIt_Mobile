import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function ReportInfo({ route }) {
  const { selectedMarker } = route.params;

  if (!selectedMarker) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Aucune donnée reçue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: "http://192.168.1.46:3001" + selectedMarker?.picture }} style={styles.image} />
      <Text style={styles.title}>Type de problème : {selectedMarker.problemtypedescription}</Text>
      <Text style={styles.text}>Description : {selectedMarker.description}</Text>
      <Text style={styles.text}>Niveau d'urgence : {selectedMarker.emergencydegree}</Text>
      <Text style={styles.text}>Statut : {selectedMarker.status}</Text>
      <Text style={styles.text}>Date de rapport : {new Date(selectedMarker.report_date).toLocaleDateString()}</Text>
      <Text style={styles.text}>Signalé par : {selectedMarker.user_email}</Text>
      <Text style={styles.text}>Latitude : {selectedMarker.latitude}</Text>
      <Text style={styles.text}>Longitude : {selectedMarker.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

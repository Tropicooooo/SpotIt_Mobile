import React from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors'; // Chemin vers le fichier de couleurs
const iconSize = 28;

export default function ReportInfo({ route, navigation }) {
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
    {/* Bouton de retour */}
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Ionicons name="arrow-back-outline" size={iconSize} color={colors.primary} />
      </TouchableOpacity>


      <Image source={{ uri: "http://192.168.1.46:3001" + selectedMarker?.picture }} style={styles.image} />
      <Text style={styles.title}>Type de problème : {selectedMarker.problemtypedescription}</Text>
      <Text style={styles.title}>Description : {selectedMarker.description}</Text>
      <Text style={styles.title}>Niveau d'urgence : {selectedMarker.emergencydegree}</Text>
      <Text style={styles.title}>Statut : {selectedMarker.status}</Text>
      <Text style={styles.title}>Date de rapport : {new Date(selectedMarker.report_date).toLocaleDateString()}</Text>
      <Text style={styles.title}>Signalé par : {selectedMarker.user_email}</Text>
      <Text style={styles.title}>Latitude : {selectedMarker.latitude}</Text>
      <Text style={styles.title}>Longitude : {selectedMarker.longitude}</Text>
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
    color: colors.primary,
    
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
  backButton: {
    position: 'absolute',
    top: '2%',
    left: '6%',
    padding: 10,
    zIndex: 20,
  },
});

import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/colors';
import styles from '../styles/ReportInfoScreenStyles.jsx';

const iconSize = 28;

export default function ReportInfoScreen({ route, navigation }) {
  const { selectedMarker } = route.params;

  if (!selectedMarker) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune donnée reçue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-outline" size={iconSize} color={colors.primary} />
      </TouchableOpacity>

      <Image
        source={{ uri: "http://192.168.1.25:3001" + selectedMarker?.picture }}
        style={styles.image}
      />

      <Text style={styles.label}>Type de problème :</Text>
      <Text style={styles.text}>{selectedMarker.problemtypedescription}</Text>

      <Text style={styles.label}>Description :</Text>
      <Text style={styles.text}>{selectedMarker.description}</Text>

      <Text style={styles.label}>Niveau d'urgence :</Text>
      <Text style={styles.text}>{selectedMarker.emergencydegree}</Text>

      <Text style={styles.label}>Statut :</Text>
      <Text style={styles.text}>{selectedMarker.status}</Text>

      <Text style={styles.label}>Date de rapport :</Text>
      <Text style={styles.text}>{new Date(selectedMarker.report_date).toLocaleDateString()}</Text>

      <Text style={styles.label}>Signalé par :</Text>
      <Text style={styles.text}>{selectedMarker.user_email}</Text>

      <Text style={styles.label}>Latitude :</Text>
      <Text style={styles.text}>{selectedMarker.latitude}</Text>

      <Text style={styles.label}>Longitude :</Text>
      <Text style={styles.text}>{selectedMarker.longitude}</Text>
    </View>
  );
}
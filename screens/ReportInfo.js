import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ReportInfo({ route }) {
  const { selectedMarker } = route.params;

  return (
    <View>
      <Text>{selectedMarker ? JSON.stringify(selectedMarker, null, 2) : "Aucune donnée reçue"}</Text>
    </View>
  );
}

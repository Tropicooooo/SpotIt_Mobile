import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function Reports({ region, onReportsFetched }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!region) return;

    const fetchReports = async () => {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const latMin = latitude - latitudeDelta;
      const latMax = latitude + latitudeDelta;
      const lngMin = longitude - longitudeDelta;
      const lngMax = longitude + longitudeDelta;

      const url = `http://192.168.1.46:3001/problem?latMin=${latMin}&latMax=${latMax}&lngMin=${lngMin}&lngMax=${lngMax}`;
      console.log("URL de la requête :", url);

      try {
        const response = await fetch(url);
        const data = await response.json();
        onReportsFetched(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des rapports :", error);
      }
      setIsLoading(false);
    };

    fetchReports();
  }, [region.latitude, region.longitude]); 

  if (isLoading) {
    return <Text>Chargement des rapports...</Text>;
  }

  return null;
}

export const fetchMarkers = async ({ region, filterType = null, filterStatus = null, emergencyDegreeMin = 0, emergencyDegreeMax = 5 }) => {
  if (!region) {
    throw new Error("Aucune région définie pour récupérer les marqueurs.");
  }

  console.log("Région de la carte :", region);
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  // Calcul des limites géographiques
  const latMin = latitude - latitudeDelta / 2;
  const latMax = latitude + latitudeDelta / 2;
  const lngMin = longitude - longitudeDelta / 2;
  const lngMax = longitude + longitudeDelta / 2;

  // Construction de la base de l'URL
  let url = `http://192.168.1.46:3001/problem?latMin=${latMin}&latMax=${latMax}&lngMin=${lngMin}&lngMax=${lngMax}`;

  // Ajout des filtres conditionnels
  const filters = [];
  if (filterType) filters.push(`type=${filterType}`);
  if (filterStatus) filters.push(`status=${filterStatus.join(',')}`);
  filters.push(`emergencyDegreeMin=${emergencyDegreeMin}`);
  filters.push(`emergencyDegreeMax=${emergencyDegreeMax}`);

  // Ajout des filtres à l'URL si disponibles
  if (filters.length > 0) {
    url += '&' + filters.join('&');
  }

  console.log("URL de la requête API :", url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la requête API.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des marqueurs :", error);
    throw error;
  }
};

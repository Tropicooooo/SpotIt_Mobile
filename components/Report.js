export const fetchMarkers = async ({ region, filterType = null, filterStatus = null, emergencyDegreeMin = 0, emergencyDegreeMax = 5 }) => {
  if (!region) {
    throw new Error("Aucune région définie pour récupérer les marqueurs.");
  }

  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  // Calcul des limites géographiques
  const latMin = latitude - latitudeDelta / 2;
  const latMax = latitude + latitudeDelta / 2;
  const lngMin = longitude - longitudeDelta / 2;
  const lngMax = longitude + longitudeDelta / 2;

  const queryParams = new URLSearchParams({
    latMin,
    latMax,
    lngMin,
    lngMax,
    ...(filterType ? { type: filterType } : {}),
    ...(filterStatus ? { status: filterStatus } : {}),
    emergencyDegreeMin,
    emergencyDegreeMax,
  });
  
  const url = `http://192.168.1.46:3001/problem?${queryParams}`;
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

export async function reverseGeocode(latitude, longitude) {
    console.log('reverseGeocode', latitude, longitude);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      console.log('reverseGeocode url:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('reverseGeocode data:', data.display_name);
      return data.display_name;
    } catch (error) {
      console.error('Géocodage inversé échoué :', error);
      return null;
    }
}
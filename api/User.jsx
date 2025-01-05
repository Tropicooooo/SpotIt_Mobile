import { useEffect } from "react";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
function User({ onNameFetched }) {
  useEffect(() => {
    fetch(`http://${API_URL}:3001/user/admin@example.com`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        onNameFetched(data.firstname + " " + data.lastname); // Envoi du nom à Home
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      });
  }, [onNameFetched]);

  return null; // Pas de rendu à faire ici
}

export default User;

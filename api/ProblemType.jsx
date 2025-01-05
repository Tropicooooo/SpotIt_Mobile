import { useEffect } from "react";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;

function ProblemType({ onTypeFetched }) {
  useEffect(() => {
    fetch(`http://${API_URL}:3001/reportType`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        onTypeFetched(data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des types de problèmes :", err);
      });
  }, [onTypeFetched]);

  return null; // Pas de rendu à faire ici
}

export default ProblemType;

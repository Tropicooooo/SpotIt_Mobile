import { useEffect } from "react";
import { API_URL } from 'dotenv/config';

function ProblemType({ onTypeFetched }) {
  useEffect(() => {
    fetch(`${API_URL}/reportType`)
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

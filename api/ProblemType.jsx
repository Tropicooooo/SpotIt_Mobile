import { useEffect } from "react";

function ProblemType({ onTypeFetched }) {
  useEffect(() => {
    fetch("http://192.168.1.46:3001/reportType")
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

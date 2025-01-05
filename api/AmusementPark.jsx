import { useEffect } from "react";
import { API_URL } from 'dotenv/config';
function AmusementPark({ onTypeFetched }) {
        useEffect(() => {
        fetch(`${API_URL}/amusement-park`)
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
            console.error("Erreur lors de la récupération des parcs d'attractions :", err);
        });
    }, [onTypeFetched]);

    return null;
}

export default AmusementPark;
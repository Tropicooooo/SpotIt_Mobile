import { useEffect } from "react";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
function Restaurant({ onTypeFetched }) {
    useEffect(() => {
        fetch(`http://${API_URL}:3001/restaurant/`)
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
            console.error("Erreur lors de la récupération des restaurants :", err);
        });
    }, [onTypeFetched]);

    return null;
}

export default Restaurant;
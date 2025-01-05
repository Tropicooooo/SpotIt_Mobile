import { useEffect } from "react";
import { API_URL } from 'dotenv/config';

function Restaurant({ onTypeFetched }) {
    useEffect(() => {
        fetch(`${API_URL}/restaurant/`)

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
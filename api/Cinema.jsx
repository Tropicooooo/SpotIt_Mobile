import { useEffect } from "react";
import { API_URL } from 'dotenv/config';

function Cinema({ onTypeFetched }) {
    useEffect(() => {
        fetch(`${API_URL}/cinema/`)
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
            console.error("Erreur lors de la récupération des cinemas :", err);
        });
    }, [onTypeFetched]);

    return null;
}

export default Cinema;
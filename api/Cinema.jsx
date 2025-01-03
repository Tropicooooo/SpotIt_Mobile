import { useEffect } from "react";

function Cinema({ onTypeFetched }) {
    useEffect(() => {
        fetch("http://192.168.1.46:3001/cinema/")
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
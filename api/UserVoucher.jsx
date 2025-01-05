import { useEffect } from "react";
import { API_URL } from 'dotenv/config';

const user = "sophie.martin@free.be";

function UserVoucher({ onTypeFetched }) {
    useEffect(() => {
        fetch(`${API_URL}/user-voucher?email=${encodeURIComponent(user)}`
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
            console.error("Erreur lors de la récupération des bons :", err);
        });
    }, [onTypeFetched]);

    return null;
}

export default UserVoucher;
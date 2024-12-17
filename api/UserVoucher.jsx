import { useEffect } from "react";

function UserVoucher({ onTypeFetched }) {
    useEffect(() => {
        fetch("http://192.168.129.114:3001/user-vouchers")
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
            console.error("Erreur lors de la récupération des inventaires :", err);
        });
    }, [onTypeFetched]);

    return null;
}

export default UserVoucher;
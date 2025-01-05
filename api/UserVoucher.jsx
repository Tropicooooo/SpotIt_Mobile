import { useEffect } from "react";

const user = "sophie.martin@free.be";

function UserVoucher({ onTypeFetched }) {
    useEffect(() => {
        fetch(`http://192.168.1.25:3001/user-voucher?email=${encodeURIComponent(user)}`)
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
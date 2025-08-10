import { useEffect } from "react";
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
import { useSelector } from "react-redux";

function UserVoucher({ onTypeFetched }) {
      const user = useSelector((state) => state.user.user);
    useEffect(() => {
        fetch(`http://${API_URL}:3001/v1/user-voucher?email=${encodeURIComponent(user.email)}`)
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
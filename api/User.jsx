import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // à ne pas oublier
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

function User({ onNameFetched }) {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenJWT');
        const response = await fetch(`http://${API_URL}:3001/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        onNameFetched(`${data.firstname} ${data.lastname}`);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    };

    fetchUser();
  }, [onNameFetched]);

  return null;
}

export default User;

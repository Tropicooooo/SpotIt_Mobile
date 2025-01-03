import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator  } from 'react-native';
import colors from '../constants/colors';
export default function Leaderboard() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://192.168.1.46:3001/leaderboard');
        const data = await response.json();
  
        if (data && data.length > 0) {
          // Ajouter un champ id basé sur email pour chaque utilisateur réel
          const transformedUsers = data.map(user => ({
            ...user,
            id: user.email, // Utilisez `email` comme identifiant unique
            name: `${user.first_name} ${user.last_name.charAt(0)}.`, //affiche firstname et une seule lettre du lastname
          }));
  
          // Générer des utilisateurs fictifs pour compléter jusqu'à 10
          const fakeUsers = [];
          for (let i = data.length; i < 10; i++) {
            fakeUsers.push({
              id: `fake-${i}`,
              name: "Inconnu",
              experience: 0,
            });
          }
  
          // Combine les vrais utilisateurs transformés avec les faux
          setUsers([...transformedUsers, ...fakeUsers]);
        } else {
          // Si aucun utilisateur, créer 10 utilisateurs fictifs
          const fakeUsers = Array.from({ length: 10 }, (_, index) => ({
            id: `fake-${index}`,
            name: "Inconnu",
            experience: 0,
          }));
          setUsers(fakeUsers);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLeaderboard();
  }, []);
  
  

  const renderPodium = () => {
      return (
        <View style={styles.podium}>
          <View style={styles.podiumUser}>
          <Image source={require('../images/profile.jpg')} style={styles.podiumImageSmall} />
            <Text style={styles.podiumName}>{users[1].name}</Text>
            <Text style={styles.podiumPoints}>{users[1].experience} exp</Text>
          </View>
          <View style={styles.podiumUser}>
          <Image source={require('../images/profile.jpg')} style={styles.podiumImageLarge} />
          <Text style={styles.podiumName}>{users[0].name}</Text>
          <Text style={styles.podiumPoints}>{users[0].experience} exp</Text>
          </View>
          <View style={styles.podiumUser}>
          <Image source={require('../images/profile.jpg')} style={styles.podiumImageSmall} />
          <Text style={styles.podiumName}>{users[2].name}</Text>
          <Text style={styles.podiumPoints}>{users[2].experience} exp </Text>
          </View>
        </View>
      );
    };
  
    const renderItem = ({ item, index }) => {
      if (index < 3) {
        return null; // Passer les 3 premiers utilisateurs car déjà affichés sur le podium
      }
      return (
        <View style={styles.user}>
          <Text style={styles.userIndex}>{index + 1}.</Text>
          <Image source={require('../images/profile.jpg')} style={styles.userImage} />
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userPoints}>{item.experience} exp</Text>
        </View>
      );
    };

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        {renderPodium()}
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    podium: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      marginBottom: 20,
      marginTop: '20%',
    },
    podiumUser: {
      alignItems: 'center',
    },
    podiumImageLarge: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    podiumImageSmall: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
      marginTop: 20,
    },
    podiumName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,

    },
    podiumPoints: {
      fontSize: 14,
      color: colors.primary,
    },
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    userIndex: {
      width: 30,
      fontSize: 16,
      fontWeight: 'bold',
        color: colors.primary,
    },
    userImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: 10,
    },
    userName: {
      flex: 1,
      fontSize: 16,
      color: colors.primary,
    },
    userPoints: {
      fontSize: 16,
      fontWeight: 'bold',
        color: colors.primary,
    },
  });
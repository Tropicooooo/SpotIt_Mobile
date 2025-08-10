import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
import styles from '../styles/LeaderboardScreenStyles.jsx';

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://${API_URL}:3001/v1/leaderboard`);
        const data = await response.json();

        if (data && data.length > 0) {
          const transformedUsers = data.map(user => ({
            ...user,
            id: user.email,
            name: `${user.first_name} ${user.last_name.charAt(0)}.`,
          }));

          const fakeUsers = [];
          for (let i = data.length; i < 10; i++) {
            fakeUsers.push({
              id: `fake-${i}`,
              name: "Inconnu",
              experience: 0,
            });
          }

          setUsers([...transformedUsers, ...fakeUsers]);
        } else {
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
          <Image source={require('../images/number2.jpg')} style={styles.podiumImageSmall} />
          <Text style={styles.podiumName}>{users[1].name}</Text>
          <Text style={styles.podiumPoints}>{users[1].experience} exp</Text>
        </View>
        <View style={styles.podiumUser}>
          <Image source={require('../images/number1.jpg')} style={styles.podiumImageLarge} />
          <Text style={styles.podiumName}>{users[0].name}</Text>
          <Text style={styles.podiumPoints}>{users[0].experience} exp</Text>
        </View>
        <View style={styles.podiumUser}>
          <Image source={require('../images/number3.png')} style={styles.podiumImageSmall} />
          <Text style={styles.podiumName}>{users[2].name}</Text>
          <Text style={styles.podiumPoints}>{users[2].experience} exp </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    if (index < 3) {
      return null;
    }
    return (
      <View style={styles.user}>
        <Text style={styles.userIndex}>{index + 1}.</Text>
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
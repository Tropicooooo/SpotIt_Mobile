import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../styles/RewardsScreenStyles.jsx';
import AmusementPark from '../api/AmusementPark.jsx';
import Cinema from '../api/Cinema.jsx';
import Restaurant from '../api/Restaurant.jsx';

const profileImage = require('../images/profile.jpg');

const RewardsScreen = () => {
  const [isCatalogue, setIsCatalogue] = useState(true);
  const [amusementParks, setAmusementParks] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const inventoryItems = [
    { uri: 'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn', name: 'Pizza Mania', expiration: '2023-12-31' },
    { uri: 'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E', name: 'Cinéma Gent', expiration: '2023-11-30' },
    { uri: 'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true', name: 'Walibi', expiration: '2023-10-31' },
    { uri: 'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn', name: 'Pizza Mania', expiration: '2023-12-31' },
    { uri: 'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E', name: 'Cinéma Gent', expiration: '2023-11-30' },
    { uri: 'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true', name: 'Walibi', expiration: '2023-10-31' },
  ];

  const handleAmusementParksFetched = (data) => {
    setAmusementParks(data.amusementParks);
  };

  const handleCinemasFetched = (data) => {
    setCinemas(data.cinemas);
  };

  const handleRestaurantsFetched = (data) => {
    setRestaurants(data.restaurants);
  };

  return (
    <View style={styles.container}>
      <AmusementPark onTypeFetched={handleAmusementParksFetched} />
      <Cinema onTypeFetched={handleCinemasFetched} />
      <Restaurant onTypeFetched={handleRestaurantsFetched} />

      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>GUEST</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, isCatalogue && styles.activeToggle]} onPress={() => setIsCatalogue(true)}>
          <Text style={[styles.toggleText, isCatalogue && styles.activeToggleText]}>CATALOGUE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, !isCatalogue && styles.activeToggle]} onPress={() => setIsCatalogue(false)}>
          <Text style={[styles.toggleText, !isCatalogue && styles.activeToggleText]}>INVENTAIRE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isCatalogue ? (
          <View>
            <Text style={styles.sectionTitle}>RESTAURANTS</Text>
            <View style={styles.rewardRow}>
              {restaurants.map((restaurant, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: 'http://192.168.129.114:3001' + restaurant.picture }} style={styles.rewardImage} />
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>CINÉMAS</Text>
            <View style={styles.rewardRow}>
              {cinemas.map((cinema, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: 'http://192.168.129.114:3001' + cinema.picture }} style={styles.rewardImage} />
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>PARCS D'ATTRACTIONS</Text>
            <View style={styles.rewardRow}>
              {amusementParks.map((amusementPark, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: 'http://192.168.129.114:3001' + amusementPark.picture }} style={styles.rewardImage} />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.flatListContainer}>
            <FlatList
              data={inventoryItems}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.rewardBox}>
                  <Image source={{ uri: item.uri }} style={styles.rewardBoxImage} />
                  <Text style={styles.rewardBoxText}>{item.name}</Text>
                  <QRCode value={`Reward: ${item.name}, Expiration: ${item.expiration}`} size={150} style={styles.qrCode} />
                  <Text style={styles.expirationDate}>Date d'expiration: {item.expiration}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RewardsScreen;
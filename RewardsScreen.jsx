import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from './RewardsScreenStyles.jsx';

const RewardsScreen = () => {
  const [isCatalogue, setIsCatalogue] = useState(true);

  const restaurantImages = [
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn',
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn',
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn',
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn',
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn',
    'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn'
  ];

  const cinemaImages = [
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E',
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E',
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E',
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E',
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E',
    'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E'
  ];

  const amusementParkImages = [
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true',
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true',
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true',
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true',
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true',
    'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true'
  ];

  const inventoryItems = [
    { uri: 'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn', name: 'Pizza Mania', expiration: '2023-12-31' },
    { uri: 'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E', name: 'Cinéma Gent', expiration: '2023-11-30' },
    { uri: 'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true', name: 'Walibi', expiration: '2023-10-31' },
    { uri: 'https://www.pizzamania.be/sites/www.pizzamania.be/files/styles/hd/public/uploads/pizzas-a-emporter-namur.jpg?itok=U2mT5cYn', name: 'Pizza Mania', expiration: '2023-12-31' },
    { uri: 'https://visit.gent.be/sites/default/files/styles/social_media/public/media/img/2022-01/VisitReeks133-DT012880.jpg?itok=kqYAHR0E', name: 'Cinéma Gent', expiration: '2023-11-30' },
    { uri: 'https://www.walibi.be/adobe/dynamicmedia/deliver/dm-aid--77dcb454-48da-4a2c-890d-c233ebfb93fd/43-cobra.jpg?quality=85&preferwebp=true', name: 'Walibi', expiration: '2023-10-31' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://cdn.mos.cms.futurecdn.net/nyU6UyNw4B4QVLj69n5hbe-1200-80.jpg' }} style={styles.profileImage} />
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
              {restaurantImages.map((imageUri, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: imageUri }} style={styles.rewardImage} />
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>CINÉMAS</Text>
            <View style={styles.rewardRow}>
              {cinemaImages.map((imageUri, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: imageUri }} style={styles.rewardImage} />
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>PARCS D'ATTRACTIONS</Text>
            <View style={styles.rewardRow}>
              {amusementParkImages.map((imageUri, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Image source={{ uri: imageUri }} style={styles.rewardImage} />
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
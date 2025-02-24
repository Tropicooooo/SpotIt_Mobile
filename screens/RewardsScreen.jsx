import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../styles/RewardsScreenStyles.jsx';
import AmusementPark from '../api/AmusementPark.jsx';
import Cinema from '../api/Cinema.jsx';
import Restaurant from '../api/Restaurant.jsx';
import UserVoucher from '../api/UserVoucher.jsx';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.API_URL;
const profileImage = require('../images/profile.jpg');

const RewardsScreen = () => {
  const [isCatalogue, setIsCatalogue] = useState(true);
  const [amusementParks, setAmusementParks] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const handleAmusementParksFetched = (data) => setAmusementParks(data.amusementParks);
  const handleCinemasFetched = (data) => setCinemas(data.cinemas);
  const handleRestaurantsFetched = (data) => setRestaurants(data.restaurants);
  const handleUserVouchersFetched = (data) => setUserVouchers(data.userVouchers);

  const openRewardDetails = (reward) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const claimReward = () => {
    if (!selectedReward) {
      console.log("Aucune récompense sélectionnée.");
      return;
    }

    console.log(`Récompense prise : ${selectedReward.label}`);

    fetch(`http://${API_URL}:3001/user-vouchers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "sophie.martin@free.be",
        label: selectedReward.label,
        description: selectedReward.description,
        points_number: selectedReward.pointsNumber,
        picture: selectedReward.picture
      }),
    })
      .then(response => {
        if (!response.ok) {
          console.error("Erreur dans la réponse de l'API:", response.status);
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Voucher ajouté avec succès:', data);
        setUserVouchers(prevVouchers => [...prevVouchers, data]);
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du voucher :", err);
      });

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AmusementPark onTypeFetched={handleAmusementParksFetched} />
      <Cinema onTypeFetched={handleCinemasFetched} />
      <Restaurant onTypeFetched={handleRestaurantsFetched} />
      <UserVoucher onTypeFetched={handleUserVouchersFetched} />

      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>Sophie</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isCatalogue && styles.activeToggle]}
          onPress={() => setIsCatalogue(true)}
        >
          <Text style={[styles.toggleText, isCatalogue && styles.activeToggleText]}>CATALOGUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isCatalogue && styles.activeToggle]}
          onPress={() => setIsCatalogue(false)}
        >
          <Text style={[styles.toggleText, !isCatalogue && styles.activeToggleText]}>INVENTAIRE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isCatalogue ? (
          <View>
            {/* Section Restaurants */}
            <Text style={styles.sectionTitle}>RESTAURANTS</Text>
            <View style={styles.rewardRow}>
              {restaurants.map((restaurant, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.rewardItem}
                  onPress={() => openRewardDetails(restaurant)}
                >
                  <Image
                    source={{ uri: `http://${API_URL}:3001` + restaurant.picture }}
                    style={styles.rewardImage}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Section Cinémas */}
            <Text style={styles.sectionTitle}>CINÉMAS</Text>
            <View style={styles.rewardRow}>
              {cinemas.map((cinema, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.rewardItem}
                  onPress={() => openRewardDetails(cinema)}
                >
                  <Image
                    source={{ uri: `http://${API_URL}:3001` + cinema.picture }}
                    style={styles.rewardImage}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Section Parcs d'Attractions */}
            <Text style={styles.sectionTitle}>PARCS D'ATTRACTIONS</Text>
            <View style={styles.rewardRow}>
              {amusementParks.map((amusementPark, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.rewardItem}
                  onPress={() => openRewardDetails(amusementPark)}
                >
                  <Image
                    source={{ uri: `http://${API_URL}:3001` + amusementPark.picture }}
                    style={styles.rewardImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.inventoryContainer}>
            {/* Inventaire des Bons */}
            <Text style={styles.sectionTitle}>INVENTAIRE DES BONS</Text>
            {userVouchers.map((voucher, index) => (
              <View key={index} style={styles.rewardBox}>
                <Text style={styles.rewardBoxText}>{voucher.voucherLabel}</Text>
                <Text style={styles.expirationDate}>
                  Date de réclamation : {new Date(voucher.claimDate).toLocaleDateString()}
                </Text>
                <Text style={styles.expirationDate}>
                  Date d'expiration : {new Date(voucher.expirationDate).toLocaleDateString()}
                </Text>
                <QRCode value={`Code: ${voucher.code}`} size={150} style={styles.qrCode} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modale pour afficher les détails de la récompense */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedReward && (
              <>
                <Text style={[styles.rewardName, { textTransform: 'uppercase' }]}>{selectedReward.label}</Text>
                <Text style={styles.rewardDescription}>{selectedReward.description}</Text>
                <Text style={styles.rewardPoints}>Points nécessaires : {selectedReward.pointsNumber}</Text>

                <TouchableOpacity style={styles.claimButton} onPress={claimReward}>
                  <Text style={styles.claimButtonText}>Je le prends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RewardsScreen;
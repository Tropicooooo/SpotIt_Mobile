import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import AmusementPark from '../api/AmusementPark.jsx';
import Cinema from '../api/Cinema.jsx';
import Restaurant from '../api/Restaurant.jsx';
import UserVoucher from '../api/UserVoucher.jsx';
import styles from '../styles/RewardsScreenStyles.jsx';

const profileImage = require('../images/profile.jpg');

const RewardsScreen = () => {
  const [isCatalogue, setIsCatalogue] = useState(true);
  const [amusementParks, setAmusementParks] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const fetchData = (type, setter) => {
    switch (type) {
      case 'amusementParks':
        setter(data => setAmusementParks(data.amusementParks));
        break;
      case 'cinemas':
        setter(data => setCinemas(data.cinemas));
        break;
      case 'restaurants':
        setter(data => setRestaurants(data.restaurants));
        break;
      case 'userVouchers':
        setter(data => setUserVouchers(data.userVouchers));
        break;
      default:
        break;
    }
  };

  const openRewardDetails = (reward) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const claimReward = () => {
    if (!selectedReward) return console.log("Aucune récompense sélectionnée.");

    console.log(`Récompense prise : ${selectedReward.label}`);

    fetch('http://localhost:3001/user-vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "sophie.martin@free.be",
        label: selectedReward.label,
        description: selectedReward.description,
        points_number: selectedReward.pointsNumber,
        picture: selectedReward.picture
      }),
    })
      .then(response => response.ok ? response.json() : Promise.reject(`Erreur HTTP: ${response.status}`))
      .then(data => {
        console.log('Voucher ajouté avec succès:', data);
        setUserVouchers(prevVouchers => [...prevVouchers, data]);
      })
      .catch(err => console.error("Erreur lors de l'ajout du voucher :", err));

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AmusementPark onTypeFetched={data => fetchData('amusementParks', data)} />
      <Cinema onTypeFetched={data => fetchData('cinemas', data)} />
      <Restaurant onTypeFetched={data => fetchData('restaurants', data)} />
      <UserVoucher onTypeFetched={data => fetchData('userVouchers', data)} />

      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>Sophie</Text>
      </View>

      <View style={styles.toggleContainer}>
        {['CATALOGUE', 'INVENTAIRE'].map((title, idx) => (
          <TouchableOpacity
            key={title}
            style={[styles.toggleButton, isCatalogue === (idx === 0) && styles.activeToggle]}
            onPress={() => setIsCatalogue(idx === 0)}
          >
            <Text style={[styles.toggleText, isCatalogue === (idx === 0) && styles.activeToggleText]}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isCatalogue ? (
          <>
            <Section title="RESTAURANTS" items={restaurants} onPress={openRewardDetails} />
            <Section title="CINÉMAS" items={cinemas} onPress={openRewardDetails} />
            <Section title="PARCS D'ATTRACTIONS" items={amusementParks} onPress={openRewardDetails} />
          </>
        ) : (
          <Inventory userVouchers={userVouchers} />
        )}
      </ScrollView>

      {modalVisible && selectedReward && (
        <RewardDetailsModal reward={selectedReward} onClose={() => setModalVisible(false)} onClaim={claimReward} />
      )}
    </View>
  );
};

const Section = ({ title, items, onPress }) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.rewardRow}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.rewardItem} onPress={() => onPress(item)}>
          <Image source={{ uri: `http://localhost:3001${item.picture}` }} style={styles.rewardImage} />
        </TouchableOpacity>
      ))}
    </View>
  </>
);

const Inventory = ({ userVouchers }) => (
  <View style={styles.inventoryContainer}>
    <Text style={styles.sectionTitle}>INVENTAIRE DES BONS</Text>
    {userVouchers.map((voucher, index) => (
      <View key={index} style={styles.rewardBox}>
        <Text style={styles.rewardBoxText}>{voucher.voucherLabel}</Text>
        <Text style={styles.expirationDate}>Date de réclamation : {new Date(voucher.claimDate).toLocaleDateString()}</Text>
        <Text style={styles.expirationDate}>Date d'expiration : {new Date(voucher.expirationDate).toLocaleDateString()}</Text>
        <QRCode value={`Code: ${voucher.code}`} size={150} style={styles.qrCode} />
      </View>
    ))}
  </View>
);

const RewardDetailsModal = ({ reward, onClose, onClaim }) => (
  <Modal visible={true} animationType="slide" transparent={true} onRequestClose={onClose}>
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <Text style={[styles.rewardName, { textTransform: 'uppercase' }]}>{reward.label}</Text>
        <Text style={styles.rewardDescription}>{reward.description}</Text>
        <Text style={styles.rewardPoints}>Points nécessaires : {reward.pointsNumber}</Text>
        <TouchableOpacity style={styles.claimButton} onPress={onClaim}>
          <Text style={styles.claimButtonText}>Je le prends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default RewardsScreen;
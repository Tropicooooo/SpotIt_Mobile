import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    marginTop: "15%",
  },

  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#008000',
    borderRadius: 20,
    marginHorizontal: 8,
  },

  activeToggle: {
    backgroundColor: '#008000',
  },

  toggleText: {
    fontSize: 18,
    color: '#008000',
  },

  activeToggleText: {
    color: '#ffffff',
  },

  content: {
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008000',
    marginVertical: 12,
  },

  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  rewardItem: {
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },

  rewardImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  inventoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },

  rewardBox: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#008000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  rewardBoxText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },

  expirationDate: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 4,
  },

  qrCode: {
    marginVertical: 16,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    width: 280,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
  },
  
  rewardName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#008000',
    marginBottom: 12,
  },
  
  rewardDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 24,
  },
  
  rewardPoints: {
    fontSize: 18,
    color: '#008000',
    marginBottom: 20,
  },

  claimButton: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginVertical: 10,
  },

  claimButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  closeButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginVertical: 5,
  },

  closeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
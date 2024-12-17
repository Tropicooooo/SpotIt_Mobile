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

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  userName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },

  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#008000',
    borderRadius: 20,
    marginHorizontal: 8,
  },

  activeToggle: {
    backgroundColor: '#008000',
  },

  toggleText: {
    fontSize: 16,
    color: '#008000',
  },

  activeToggleText: {
    color: '#ffffff',
  },

  content: {
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
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
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },

  rewardPoints: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    backgroundColor: '#008000',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },

  inventoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },

  rewardBox: {
    width: 200,
    height: 500,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#008000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 50,
    paddingTop: 50,
  },

  rewardBoxImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },

  rewardBoxText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },

  qrCode: {
    marginVertical: 20,
  },

  expirationDate: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
  },

  flatListContainer: {
    marginVertical: 30,
  },

  flatListItem: {
    marginHorizontal: 8,
    alignItems: 'center',
  }
});
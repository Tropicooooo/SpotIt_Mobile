import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },

  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  noDataText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },

  backButton: {
    position: 'absolute',
    top: '2%',
    left: '6%',
    padding: 10,
    zIndex: 20,
  },
});
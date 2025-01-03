import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  backButton: {
    position: 'absolute',
    top: '6%',
    left: '6%',
    padding: 10,
    zIndex: 20,
  },

  mapWrapper: {
    marginTop: '10%',
    height: '20%',
    paddingHorizontal: '4%',
    position: 'relative',
  },

  contentContainer: {
    padding: 20,
    paddingHorizontal: '8%',
  },

  imageButton: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    top: '80%',
    borderRadius: 15,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  type: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: '5%',
  },

  adresse: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: '30%',
  },

  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 5,
  },

  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    height: 100,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    textAlignVertical: 'top',
  },

  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },

  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  rectanglesContainer: {
    maxHeight: 150,
    marginVertical: 10,
    marginTop: '8%',
  },

  rectanglesContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  rectangle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  addressText: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 35,
  },
});
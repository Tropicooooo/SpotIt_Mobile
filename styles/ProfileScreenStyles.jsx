import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  profileTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 40,
  },
  buttonContainer: {
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    overflow: 'hidden',
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  dateButton: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

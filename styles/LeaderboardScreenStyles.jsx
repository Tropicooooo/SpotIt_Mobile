import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  podium: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: '20%',
  },

  podiumUser: {
    alignItems: 'center',
  },

  podiumImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  podiumImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 20,
  },

  podiumName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },

  podiumPoints: {
    fontSize: 14,
    color: colors.primary,
  },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },

  userIndex: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },

  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },

  userName: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
  },

  userPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
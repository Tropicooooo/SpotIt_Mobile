import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  menuButton: {
    padding: 10,
    color: colors.primary,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  aboutText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

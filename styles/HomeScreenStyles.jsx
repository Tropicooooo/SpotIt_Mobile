import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  mapWrapper: {
    height: "88%",
    paddingHorizontal: "4%",
    position: "relative",
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

  modalOptionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOptionContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  modalOptionText: {
    fontSize: 18,
    marginVertical: 10,
  },

  modalOptioncloseButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },

  modalOptioncloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  fabContainer: {
    position: "absolute",
    bottom: "15%",
    right: "5%",
  },

  fabGroup: {
    backgroundColor: colors.primary,
  },

  reportButton: {
    position: "absolute",
    bottom: "3%",
    left: "10%",
    right: "10%",
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: "center",
  },

  reportButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  filtreLevel: {
    backgroundColor: "white",
    color: colors.primary,
    left: "5%",
    right: "5%",
    alignItems: "center",
    paddingHorizontal: "4%",
    position: "absolute",
    borderRadius: 10,
    elevation: 5,
    top: "40%",
  },

  sliderLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },

  filtreLevelButton: {
    position: "absolute",
    left: "10%",
    right: "10%",
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: "center",
    top: "150%",
  },

  filtreLevelButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  filtreStatut: {
    backgroundColor: "white",
    left: "5%",
    right: "5%",
    alignItems: "center",
    paddingHorizontal: "4%",
    position: "absolute",
    borderRadius: 10,
    elevation: 5,
    top: "40%",
  },

  filtreStatutLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },

  filtreStatutText: {
    fontSize: 16,
    color: colors.primary,
    marginVertical: 5,
  },

  filtreStatutButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 20,
  },

  filtreStatutButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  selectedItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
  },

  item: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginVertical: 5,
  },

  itemText: {
    color: "black",
  },

  selectedItemText: {
    color: "white",
  },
});
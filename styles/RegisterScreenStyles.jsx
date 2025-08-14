import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  header: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },

  form: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  datePickerButton: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  datePickerText: {
    fontSize: 14,
    color: "#555",
  },

  submitButton: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  link: {
    marginTop: 15,
    color: "#28a745",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
import { StyleSheet, Text, View } from 'react-native';

export default function Rewards() {
    return (
        <View style={styles.container}>
            <Text>Rewards Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

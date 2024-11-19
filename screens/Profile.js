import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text>Profile Page</Text>
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

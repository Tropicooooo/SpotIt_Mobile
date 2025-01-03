import { TextInput } from 'react-native-paper';
import { StyleSheet, Image } from 'react-native';

function TextInputField({ placeholder, imageSource, value, onChangeText, changeAllowed}) {
    return (
        <TextInput
            placeholder={placeholder}
            editable={changeAllowed ? false : true}
            style={styles.input}
            mode="outlined"
            outlineStyle={{ borderRadius: 25 }}
            theme={{
                colors: {
                    primary: '#058C42',  // Couleur de surbrillance
                    outline: '#058C42', // Couleur de la bordure
                },
                
            }}
            value={value}
            onChangeText={onChangeText}
            left={imageSource &&<TextInput.Icon icon={() => (
                <Image 
                    source={imageSource} 
                    style={{ width: 24, height: 24, resizeMode: 'contain' }} 
                    
                />
            )} />}
        />
    );
}

export default TextInputField;

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 40,
        backgroundColor: 'transparent',
        color: '#000',
    },
});


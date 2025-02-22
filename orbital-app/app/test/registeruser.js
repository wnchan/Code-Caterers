import { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg('Please provide a valid email address.');
            return;
        }
        if (password == '') {
            setErrMsg('Please provide a valid email password.');
            return;
        }
        setLoading(true);
        setErrMsg('');
        setLoading(false);
    }
    return (
        <View style={styles.wholeThing}>

            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')} />

            <Text style={styles.register}>Create an Account:</Text>

            <Text style={styles.bold}>Email:</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                testID="emailInput"
            />

            <Text style={styles.bold}>Password:</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                testID="passwordInput"
            />
            {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
            <View style={styles.container}>
                <Button style={[styles.buttonContainer, { alignSelf: 'center' }]} onPress={handleSubmit}><Text style={styles.button}>Send Verification Email</Text></Button>
            </View>
            {loading && <ActivityIndicator style={styles.indicator} />}
            <Text style={styles.bold}>
                Note: After creating your account, please check your email for a verification link to complete the registration process.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30,
    },
    register: {
        fontWeight: 'bold',
        fontSize: 34,
        marginTop: 10,
    },
    bold: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 3,
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#FFF5FA',
        flex: 1,
        padding: 10,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        padding: 5,
        marginTop: 15,
        width: 200,
        borderWidth: 1,
        borderColor: '#FFBBDF',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        color: '#2C0080',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginTop: 15,
    },
    indicator: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
    },
});
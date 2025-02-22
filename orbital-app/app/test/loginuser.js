import { useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";

export default function LoginPage() {
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
            setErrMsg('Please provide a valid password.');
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

            <Text style={styles.sign}>User Sign In:</Text>

            <Text style={styles.bold}>Email:</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                testID="emailInput" />

            <Text style={styles.bold}>Password:</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                testID="passwordInput" />
            {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
            <View style={styles.container}>
                <Button
                    style={[styles.buttonContainer, { alignSelf: 'center' }]}
                    onPress={handleSubmit}><Text style={styles.button}>Sign In</Text></Button>
            </View>
            {loading && <ActivityIndicator style={styles.indicator} />}
            <Text style={styles.text}>Don't have an account, create an account below.</Text>
            <View style={styles.container}>
            </View>

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
    sign: {
        fontWeight: 'bold',
        fontSize: 34,
        marginTop: 10,
    },
    bold: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 3,
    },
    container: {
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    wholeThing: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FFF5FA',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        backgroundColor: '#FFECF6',
        padding: 1,
        borderWidth: 1,
        borderColor: '#FFBBDF',
        width: 180,
        justifyContent: 'center',
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
    text: {
        fontWeight: 'bold',
        marginTop: 15,
    },
});
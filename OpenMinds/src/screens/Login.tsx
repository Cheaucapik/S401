import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {Colors} from '../constants/Colors' 
import Email from '../components/Email'
import Lock from '../components/Lock'
import {useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../context/AuthContext'
import { ENDPOINTS } from '../config/api';

const Login = ({navigation} : any) => {
    const { setUserToken } = useAuth();

    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [eye, setEye] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        try{
            const response = await fetch(`${ENDPOINTS.LOGIN}`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    email : email.trim(),
                    password : mdp,
                }),
            });

            const data = await response.json();
            if(response.ok && data.token){
                console.log("Réponse du serveur :", data);

                if(rememberMe){
                    await AsyncStorage.setItem('userToken', data.token);
                }

                await AsyncStorage.setItem('userData', JSON.stringify(data.user));
                setUserToken(data.token);

                console.log("Connexion réussie")
            }
            else console.log("Erreur", data.error);
        }
        catch(error){
            console.log(error);
        }
    }

    return (
    <LinearGradient  style={styles.container}
                        colors={[Colors.pink, Colors.purple]} 
                        locations={[0.05, 0.2]}
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 0, y: 1 }}>
    <Image source={ require("../assets/logo.png") } style={styles.image} resizeMode="contain" />
        <View style={styles.form}>
            <Text style={styles.titre}>Bon retour parmi nous !</Text>
            <Text style={{color : Colors.font, textAlign : 'center', marginHorizontal:20, marginBottom : 30 }}>Pour accéder à l'application, veuillez vous connecter ou vous inscrire.</Text>
            <View>
                <View style={styles.searchSection}>
                            <Email />
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                placeholder="Email"
                                autoCorrect={false}
                                keyboardType="email-address"
                                onChangeText={(email) => setEmail(email)}
                            />
                </View>

                <View style={[styles.searchSection, {marginTop : 20}]}>
                            <Lock />
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                placeholder="Mot de passe"
                                autoCorrect={false}
                                secureTextEntry={!eye}
                                onChangeText={(mdp) => setMdp(mdp)}
                            />
                            <TouchableOpacity activeOpacity={1} onPress={() => setEye(!eye)}>
                                <Icon name={eye ? "eye-outline" : "eye-off-outline"} color={Colors.font} size={24}/>
                            </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection : "row", justifyContent : "space-between", marginVertical: 20, marginHorizontal : 30}}>
                <TouchableOpacity activeOpacity={1} style={{flexDirection : "row", gap : 10}}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <Icon 
                    name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"} 
                    size={24} 
                    color={Colors.font} 
                    />
                    <Text style={{color : Colors.font}}>Se souvenir de moi</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1}>
                    <Text style={{color : Colors.font}}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={1} onPress={() => handleLogin()}>
                <Text style={styles.connect}>Connectez-vous</Text>
            </TouchableOpacity>
            <View style={{flexDirection: "row", gap : 10, justifyContent : "center"}}>
                <Text style={{color : Colors.grey}}>Vous n'avez pas de compte ?</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Signup')}>
                    <Text style={{fontWeight : "bold", color : Colors.font}}>Inscrivez-vous</Text>
                </TouchableOpacity>
            </View>
        </View>
    </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    titre : {
        color : Colors.font,
        fontWeight : 'bold',
        textAlign : 'center',
        fontSize : 45,
        margin : 20,
    },
    image :{
        margin : 20,
        alignSelf: "center",
        width: '80%',
    },
    form : {
        backgroundColor : Colors.off_white,
        flex : 1,
        paddingTop : 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50, 
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        marginHorizontal : 30,
        paddingHorizontal: 10,
    },
    input: {
        backgroundColor: Colors.white,
        margin: 5,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        height : 60,
        color: '#424242',
    },
    connect : {
        paddingHorizontal : 40,
        paddingVertical : 20,
        backgroundColor : Colors.primary_blue,
        color : Colors.white,
        fontWeight : "bold",
        fontSize : 20,
        borderRadius : 30,
        margin : 30,
        textAlign : "center"
    }
})

export default Login
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, LogBox } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {Colors} from '../constants/Colors' 
import Email from '../components/Email'
import Lock from '../components/Lock'
import {useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Alert } from 'react-native';
import Calendar from '../components/Calendar'
import Account  from '../components/Account'
import DateTimePicker from '@react-native-community/datetimepicker';
import ArrowLeft from '../components/ArrowLeft'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ENDPOINTS } from '../config/api';

LogBox.ignoreLogs(['@react-native-community/datetimepicker']);

const Signup = ({navigation} : any) => {

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [dateAffichee, setDateAffichee] = useState("Sélectionner votre date");
    const [dateISO, setDateISO] = useState('');
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [eye, setEye] = useState(false);

    const handleSignUp = async () => {
        try{
            const response = await fetch(`${ENDPOINTS.SIGNUP}`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    email : email.trim(),
                    password : mdp,
                    date_naissance : dateISO,
                    prenom : prenom,
                    nom : nom,
                }),
            });

            const data = await response.json();
            if(response.ok){
                console.log("Réponse du serveur :", data);
                Alert.alert("Inscription réussie !");
                navigation.navigate('Login');
                console.log("Inscription réussie")
            }
            else if(data.error) Alert.alert("Erreur : ", data.error);
            else console.log("Erreur", data.error);
        }
        catch(error){
            console.log(error);
        }
    }

    const onChange = (event: any, selectedDate?: Date) => {
        setShow(false);
        if (event.type === "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setDateAffichee(currentDate.toLocaleDateString('fr-FR'));

            const iso = currentDate.toISOString().split('T')[0];
            setDateISO(iso);
        } else {
            console.log("Sélection annulée");
        }
    };

    return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} extraScrollHeight={50} extraHeight={100} style={{backgroundColor : Colors.white}} keyboardShouldPersistTaps="handled">
    <LinearGradient  style={styles.container}
                        colors={[Colors.pink, Colors.purple]} 
                        locations={[0.05, 0.2]}
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 0, y: 1 }}>
    <View style={styles.sideContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft />
          </TouchableOpacity>
        </View>
    <Image source={ require("../assets/logo.png") } style={styles.image} resizeMode="contain" />
        <View style={styles.form}>
            <Text style={styles.titre}>Bienvenue !</Text>
            <Text style={{color : Colors.font, textAlign : 'center', marginHorizontal:20, marginBottom : 30 }}>Pour accéder à l'application, veuillez vous connecter ou vous inscrire.</Text>
            <View>
                <View style={{flexDirection : "row", gap : 10, marginHorizontal : 30, flex : 1}}>
                    <View style={[styles.searchSection2, {flex : 1}]}>
                            <Account height={30} width={30} />
                            <TextInput
                                style={styles.input2}
                                autoCapitalize='none'
                                placeholder="Prénom"
                                autoCorrect={false}
                                onChangeText={(prenom) => setPrenom(prenom)}
                            />
                    </View>
                    <View style={[styles.searchSection2, {flex : 1}]}>
                            <TextInput
                                style={styles.input2}
                                autoCapitalize='none'
                                placeholder="Nom"
                                autoCorrect={false}
                                onChangeText={(nom) => setNom(nom)}
                            />
                </View>
            </View>
            <View style={[styles.searchSection, {marginTop : 20}]}>
                <TouchableOpacity style={[styles.input, {flexDirection: 'row', alignItems: 'center', gap : 10, marginLeft : 0, paddingLeft: 0}]} onPress={() => setShow(true)}>
                    <Calendar />
                    <Text style={{color : Colors.gray}}>{dateAffichee}</Text>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        onChange={onChange}
                        maximumDate={new Date()}
                        />
                )
            }
            </View>
            <View style={[styles.searchSection, {marginTop : 20}]}>
                            <Email />
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                placeholder="Email"
                                autoCorrect={false}
                                keyboardType='email-address'
                                textContentType="emailAddress"
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

            <TouchableOpacity activeOpacity={1} onPress={() => handleSignUp()}>
                <Text style={styles.connect}>S'inscrire</Text>
            </TouchableOpacity>
            <View style={{flexDirection: "row", gap : 10, justifyContent : "center"}}>
                <Text style={{color : Colors.grey}}>Vous n'avez pas de compte ?</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Login')}>
                    <Text style={{fontWeight : "bold", color : Colors.font, marginBottom : 50}}>Connectez-vous</Text>
                </TouchableOpacity>
            </View>
        </View>
    </LinearGradient>
    </KeyboardAwareScrollView>
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
    searchSection2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    input2: {
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
    },
    sideContainer: {
        alignItems: 'flex-start',
        marginTop: 20,
        marginLeft : 20,
    },
})

export default Signup
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Account from '../components/Account'
import Calendar from '../components/Calendar'
import DateTimePicker from '@react-native-community/datetimepicker'
import Email from '../components/Email'
import DownloadIcon from '../components/DownloadIcon'
import { ENDPOINTS } from '../config/api'

const EditProfile = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateAffichee, setDateAffichee] = useState("Sélectionner votre date");
    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState(null);

    // Charger les data au montage du composant
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserId(user.id);
                    setPrenom(user.prenom || '');
                    setNom(user.nom || '');
                    setEmail(user.email || '');

                    if (user.date_naissance) {
                        const d = new Date(user.date_naissance);
                        if (!isNaN(d.getTime())) {
                            setDate(d);
                            setDateAffichee(d.toLocaleDateString('fr-FR'));
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur chargement :", error);
            }
        };
        loadUserData();
    }, []);

    const handleSave = async () => {
        try {
            if (!userId) {
                Alert.alert("Erreur", "ID utilisateur introuvable.");
                return;
            }

            const bodyUpdate = {
                id: userId,
                prenom,
                nom,
                email,
                date_naissance: date.toISOString(),
            };

            const response = await fetch(ENDPOINTS.UPDATE_USER, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyUpdate),
            });

            const data = await response.json();

            if (response.ok) {
                // On met à jour l'AsyncStorage pour que les changements soient persistants
                await AsyncStorage.setItem('userData', JSON.stringify(data.user));
                Alert.alert("Succès", "Profil mis à jour !");
                navigation.goBack();
            } else {
                Alert.alert("Erreur", data.error || "Échec de la mise à jour.");
            }
        } catch (error) {
            console.error("Erreur Save:", error);
            Alert.alert("Erreur", "Connexion au serveur impossible.");
        }
    };

    const onChange = (event: any, selectedDate?: Date) => {
        setShow(false);
        if (event.type === "set" && selectedDate) {
            setDate(selectedDate);
            setDateAffichee(selectedDate.toLocaleDateString('fr-FR'));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <LinearGradient
                style={styles.container}
                colors={[Colors.purple, Colors.light_pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={[{ marginTop: insets.top }, styles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft />
                    </TouchableOpacity>
                </View>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.headerTitle}>{prenom} {nom}</Text>
                <Text style={styles.headerSubtitle}>{email}</Text>
            </LinearGradient>

            <View style={styles.formContainer}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={styles.inputBoxSmall}>
                        <Account height={25} width={25} />
                        <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
                    </View>
                    <View style={styles.inputBoxSmall}>
                        <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
                    </View>
                </View>

                <TouchableOpacity style={styles.inputBoxFull} onPress={() => setShow(true)}>
                    <Calendar />
                    <Text style={{ marginLeft: 10, color: dateAffichee === "Sélectionner votre date" ? '#999' : '#424242' }}>
                        {dateAffichee}
                    </Text>
                </TouchableOpacity>

                <View style={styles.inputBoxFull}>
                    <Email />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>
                {show && <DateTimePicker value={date} mode="date" display="spinner" onChange={onChange} maximumDate={new Date()} />}
            </View>

            <View style={{ marginHorizontal: 30, marginTop: 40 }}>
                <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
                    <DownloadIcon />
                    <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderBottomRightRadius: 30, borderBottomLeftRadius: 30, paddingBottom: 30, alignItems: 'center' },
    header: { width: '100%', paddingHorizontal: 20 },
    avatarPlaceholder: { marginTop: 10, width: 120, height: 120, borderRadius: 60, backgroundColor: '#CCC' },
    headerTitle: { color: '#FFF', fontSize: 25, fontWeight: 'bold', marginTop: 10 },
    headerSubtitle: { color: '#FFF', fontSize: 16, opacity: 0.8 },
    formContainer: { marginTop: 30, paddingHorizontal: 25, gap: 20 },
    inputBoxFull: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', height: 60, borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#DDD' },
    inputBoxSmall: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', height: 60, borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#DDD' },
    input: { flex: 1, marginLeft: 10, color: '#424242' },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light_blue, borderRadius: 30, paddingVertical: 15, gap: 15 },
    saveButtonText: { color: "#5955B3", fontSize: 18, fontWeight: 'bold' },
});

export default EditProfile;
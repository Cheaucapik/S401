import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Lock from '../components/Lock' // Icône cadenas
import DownloadIcon from '../components/DownloadIcon'
import { ENDPOINTS } from '../config/api'

const ChangePassword = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user.id);
            }
        };
        getUserId();
    }, []);

    const handleUpdatePassword = async () => {
        // Validation simple
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch(ENDPOINTS.UPDATE_PASSWORD, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Succès", "Votre mot de passe a été modifié !");
                navigation.goBack();
            } else {
                Alert.alert("Erreur", data.error || "Échec de la modification.");
            }
        } catch (error) {
            Alert.alert("Erreur", "Connexion au serveur impossible.");
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
                <Text style={styles.headerTitle}>Sécurité</Text>
                <Text style={styles.headerSubtitle}>Modifier votre mot de passe</Text>
            </LinearGradient>

            <View style={styles.formContainer}>
                {/* Ancien MDP */}
                <View style={styles.inputBoxFull}>
                    <Lock />
                    <TextInput
                        style={styles.input}
                        placeholder="Ancien mot de passe"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                </View>

                {/* Nouveau MDP */}
                <View style={styles.inputBoxFull}>
                    <Lock />
                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                {/* Confirmation MDP */}
                <View style={styles.inputBoxFull}>
                    <Lock />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le nouveau mot de passe"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
            </View>

            <View style={{ marginHorizontal: 30, marginTop: 40 }}>
                <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleUpdatePassword}>
                    <DownloadIcon />
                    <Text style={styles.saveButtonText}>Mettre à jour</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderBottomRightRadius: 30, borderBottomLeftRadius: 30, paddingBottom: 40, alignItems: 'center' },
    header: { width: '100%', paddingHorizontal: 20 },
    headerTitle: { color: '#FFF', fontSize: 25, fontWeight: 'bold', marginTop: 20 },
    headerSubtitle: { color: '#FFF', fontSize: 16, opacity: 0.8, marginTop: 5 },
    formContainer: { marginTop: 30, paddingHorizontal: 25, gap: 20 },
    inputBoxFull: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', height: 60, borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#DDD' },
    input: { flex: 1, marginLeft: 10, color: '#424242' },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light_blue, borderRadius: 30, paddingVertical: 15, gap: 15 },
    saveButtonText: { color: "#5955B3", fontSize: 18, fontWeight: 'bold' },
});

export default ChangePassword;
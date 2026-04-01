import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteForma from '../components/MascotteForma'
import Account from '../components/Account'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import File from '../components/File'
import Color from '../components/Color'
import Descr from '../components/Descr'

// Palette de couleurs prédéfinies pour le picker
const COULEURS = [
    '#E8E7FE', '#D6F5E3', '#FDE8E8', '#FFF3CD', '#D1ECF1',
    '#F8D7DA', '#CCE5FF', '#D4EDDA', '#FFF0E6', '#EDE7F6',
    '#B39DDB', '#81C784', '#FF8A65', '#4FC3F7', '#F06292',
    '#846EE1', '#2E7D32', '#C62828', '#1565C0', '#6A1B9A',
]

const AxesAdmin = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    // États du formulaire
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [couleur, setCouleur] = useState('#E8E7FE');
    const [couleurTitre, setCouleurTitre] = useState('#846EE1');
    const [showPickerCouleur, setShowPickerCouleur] = useState(false);
    const [showPickerTitre, setShowPickerTitre] = useState(false);
    const [loading, setLoading] = useState(false);

    const chargerAxes = async () => {
        try {
            console.log('[AxesAdmin] Chargement des axes...');
            console.log('[AxesAdmin] URL:', ENDPOINTS.THEMATIQUES);
            const response = await fetch(ENDPOINTS.THEMATIQUES);
            console.log('[AxesAdmin] Status réponse:', response.status);
            const data = await response.json();
            console.log('[AxesAdmin] Axes reçus:', data.length, 'axes');
            setFormations(data);
        } catch (error) {
            console.error('[AxesAdmin] Erreur réseau lors du chargement:', error);
            Alert.alert('Erreur réseau', 'Impossible de charger les axes. Vérifie que le serveur est lancé.');
        }
    };

    useEffect(() => {
        chargerAxes();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const newData = formations.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(newData);
    };

    const handleAjouterAxe = async () => {
        console.log('[AxesAdmin] Tentative ajout axe:', { nom, description, couleur, couleurTitre });

        if (!nom.trim() || !description.trim()) {
            Alert.alert('Champs manquants', 'Le nom et la description sont obligatoires.');
            return;
        }

        setLoading(true);
        try {
            const url = ENDPOINTS.THEMATIQUES;
            console.log('[AxesAdmin] POST vers:', url);

            const body = {
                title: nom.trim(),
                description: description.trim(),
                color: couleur,
                colorTitle: couleurTitre,
                image: 'default',
            };
            console.log('[AxesAdmin] Body envoyé:', body);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            console.log('[AxesAdmin] Status réponse POST:', response.status);
            const data = await response.json();
            console.log('[AxesAdmin] Réponse POST:', data);

            if (response.ok) {
                Alert.alert('Succès', 'Axe ajouté avec succès !');
                setVisible(false);
                setNom('');
                setDescription('');
                setCouleur('#E8E7FE');
                setCouleurTitre('#846EE1');
                chargerAxes();
            } else {
                console.error('[AxesAdmin] Erreur serveur:', data);
                Alert.alert('Erreur', data.error || 'Impossible d\'ajouter l\'axe.');
            }
        } catch (error) {
            console.error('[AxesAdmin] Erreur réseau lors de l\'ajout:', error);
            Alert.alert('Erreur réseau', 'Impossible de contacter le serveur. Vérifie ton IP dans api.ts et que le back est lancé.');
        } finally {
            setLoading(false);
        }
    };

    // Composant mini color picker
    const ColorPicker = ({ value, onChange, onClose }: { value: string; onChange: (c: string) => void; onClose: () => void }) => (
        <View style={styles.colorPickerContainer}>
            <View style={styles.colorGrid}>
                {COULEURS.map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.colorDot, { backgroundColor: c }, value === c && styles.colorDotSelected]}
                        onPress={() => { onChange(c); onClose(); }}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View>
                <LinearGradient
                    style={styles.container}
                    colors={[Colors.purple, Colors.light_pink]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={[{ marginTop: insets.top, marginBottom: 20 }, styles.header]}>
                        <Text style={styles.title}>Axes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Account />
                        </TouchableOpacity>
                    </View>
                    <MascotteForma style={styles.mascotte} />
                    <View style={styles.searchSection}>
                        <Loupe />
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            placeholder="Chercher des axes"
                            autoCorrect={false}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                </LinearGradient>
            </View>

            <View style={{ flex: 3 }}>
                <FlatList
                    data={searchQuery !== '' ? filteredData : formations}
                    keyExtractor={(item) => item.id_thematique.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('AxeDetail', { axe: item })}>
                            <ThematiqueTemplate
                                color={item.color}
                                colorTitle={item.colorTitle}
                                title={item.title}
                                duration={item.totalDuration}
                                total={item._count?.formations ?? 0}
                                image={item.image}
                                description={item.description}
                                id_thematique={item.id_thematique}
                                progression={item.progression}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                            <Text style={{ fontSize: 16, color: 'gray' }}>Aucun axe trouvé</Text>
                        </View>
                    }
                    persistentScrollbar={true}
                    bounces={true}
                />

                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Text style={styles.addAxe}>+ Ajouter un axe</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.containerModal}>

                            {/* Nom */}
                            <View style={styles.inputContainer}>
                                <File />
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Nom"
                                    placeholderTextColor="#fff"
                                    value={nom}
                                    onChangeText={setNom}
                                />
                            </View>

                            {/* Description */}
                            <View style={styles.inputContainer}>
                                <Descr />
                                <TextInput
                                    style={styles.inputModal}
                                    placeholder="Description"
                                    placeholderTextColor="#fff"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            {/* Couleur fond */}
                            <View>
                                <TouchableOpacity
                                    style={[styles.inputContainer, { justifyContent: 'space-between' }]}
                                    onPress={() => { setShowPickerCouleur(!showPickerCouleur); setShowPickerTitre(false); }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Color />
                                        <Text style={styles.inputModal}>Couleur fond</Text>
                                    </View>
                                    <View style={[styles.colorPreview, { backgroundColor: couleur }]} />
                                </TouchableOpacity>
                                {showPickerCouleur && (
                                    <ColorPicker
                                        value={couleur}
                                        onChange={setCouleur}
                                        onClose={() => setShowPickerCouleur(false)}
                                    />
                                )}
                            </View>

                            {/* Couleur titre */}
                            <View>
                                <TouchableOpacity
                                    style={[styles.inputContainer, { justifyContent: 'space-between' }]}
                                    onPress={() => { setShowPickerTitre(!showPickerTitre); setShowPickerCouleur(false); }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Color />
                                        <Text style={styles.inputModal}>Couleur titre</Text>
                                    </View>
                                    <View style={[styles.colorPreview, { backgroundColor: couleurTitre }]} />
                                </TouchableOpacity>
                                {showPickerTitre && (
                                    <ColorPicker
                                        value={couleurTitre}
                                        onChange={setCouleurTitre}
                                        onClose={() => setShowPickerTitre(false)}
                                    />
                                )}
                            </View>

                            {/* Aperçu */}
                            <View style={[styles.apercu, { backgroundColor: couleur }]}>
                                <Text style={[styles.apercuText, { color: couleurTitre }]}>Aperçu : {nom || 'Nom de l\'axe'}</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && { opacity: 0.6 }]}
                                onPress={handleAjouterAxe}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>{loading ? 'Envoi...' : '+ Ajouter un axe'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>Fermer</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        paddingBottom: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.white,
    },
    mascotte: {
        alignSelf: 'center',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    addAxe: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: Colors.primary_blue,
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 30,
        margin: 60,
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 17,
        padding: 10,
    },
    containerModal: {
        padding: 20,
        marginTop: 10,
    },
    inputModal: {
        flex: 1,
        marginLeft: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6D6F2',
        borderRadius: 30,
        paddingHorizontal: 15,
        height: 40,
        marginBottom: 12,
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
        color: '#424242',
    },
    button: {
        backgroundColor: Colors.primary_blue,
        padding: 8,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 7,
        height: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    colorPreview: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    colorPickerContainer: {
        backgroundColor: '#f9f4ff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    colorDotSelected: {
        borderWidth: 3,
        borderColor: Colors.primary_blue,
    },
    apercu: {
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        alignItems: 'center',
    },
    apercuText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default AxesAdmin;
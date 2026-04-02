import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../config/api';
import Rond from '../components/Rond';
import { LinearGradient } from 'react-native-linear-gradient';

const ChoixSession = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { formationId, formationTitle } = (route.params as any) || {};

    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`${ENDPOINTS.SESSIONS_DISPO}?idFormation=${formationId}`);
                const data = await response.json();
                setSessions(Array.isArray(data) ? data : []);
            } catch (error) {
                Alert.alert("Erreur", "Connexion au serveur impossible");
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [formationId]);

    const handleValider = () => {
        if (!selectedId) {
            Alert.alert("Sélection", "Veuillez choisir une date.");
            return;
        }
        Alert.alert("Succès", "Votre inscription a bien été prise en compte !");
        navigation.goBack();
    };

    const renderItem = ({ item }: { item: any }) => {
        const dateObj = new Date(item.date_deb);
        const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const startHour = dateObj.getHours();
        const endHour = new Date(item.date_fin).getHours();
        const isSelected = selectedId === item.id_session;

        return (
            <TouchableOpacity 
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setSelectedId(item.id_session)}
                activeOpacity={0.9}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatar} />
                    <View style={styles.infoCol}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{formationTitle}</Text>
                        </View>
                        <Text style={styles.lieu} numberOfLines={1}>{item.lieu}</Text>
                        <View style={styles.row}>
                            <Text style={styles.boldText}>Durée : 2h</Text>
                            <View style={styles.typeContainer}>
                                <Text style={styles.boldText}>
                                    {item.presentiel ? 'Présentiel' : 'À distance'}
                                </Text>
                                <Rond color={item.presentiel ? Colors.green : Colors.red} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bloc Date/Heure avec Z-Index élevé pour éviter le cadre blanc */}
                <View style={styles.dateCol}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <Text style={styles.hourText}>{startHour}h-{endHour}h</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Choisir une date de session</Text>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary_blue} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={sessions}
                    keyExtractor={(item) => item.id_session.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>Aucune session disponible.</Text>}
                />
            )}
            <TouchableOpacity onPress={handleValider}>
                <LinearGradient colors={[Colors.purple, Colors.axe_color_blue]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.btn}>
                    <Text style={styles.btnText}>Valider</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 25 },
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.font, textAlign: 'center', marginVertical: 30 },
    card: { 
        flexDirection: 'row', backgroundColor: '#FDF7FF', borderRadius: 25, 
        padding: 18, marginBottom: 15, elevation: 4, borderWidth: 2, 
        borderColor: 'transparent', position: 'relative' 
    },
    selectedCard: { borderColor: Colors.purple, backgroundColor: '#F5EFFF' },
    cardContent: { flexDirection: 'row', flex: 1, alignItems: 'center', paddingRight: 85 },
    avatar: { width: 55, height: 55, borderRadius: 30, backgroundColor: '#E2E2E2', marginRight: 15 },
    infoCol: { flex: 1 },
    badge: { backgroundColor: Colors.purple, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 6 },
    badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
    lieu: { fontSize: 13, color: '#9F9A9A', marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    typeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'transparent' },
    boldText: { fontSize: 13, fontWeight: 'bold' },
    dateCol: { position: 'absolute', right: 20, top: 25, alignItems: 'flex-end', zIndex: 999 },
    dateText: { color: Colors.purple, fontWeight: 'bold', fontSize: 18 },
    hourText: { color: '#9F9A9A', fontSize: 13, fontStyle: 'italic' },
    btn: { paddingVertical: 16, borderRadius: 35, alignItems: 'center', marginBottom: 30 },
    btnText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 50, color: 'gray' }
});

export default ChoixSession;
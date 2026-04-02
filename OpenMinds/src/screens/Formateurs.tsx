import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Modal, ScrollView, LogBox } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ENDPOINTS } from '../config/api'
import Loupe from '../components/Loupe'
import Account from '../components/Account'
import Email from '../components/Email'
import Lock from '../components/Lock'
import Calendar from '../components/Calendar'
import Trash from '../components/Trash'
import ArrowLeftPurple from '../components/ArrowLeftPurple'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

LogBox.ignoreLogs(['@react-native-community/datetimepicker'])

// ─── Carte formateur ──────────────────────────────────────────────────────────

const FormateurCard = ({ item, onDelete }: { item: any; onDelete: () => void }) => (
    <View style={styles.card}>
        <View style={styles.cardAvatar}>
            <Text style={styles.cardAvatarText}>
                {item.prenom?.[0]?.toUpperCase()}{item.nom?.[0]?.toUpperCase()}
            </Text>
        </View>
        <Text style={styles.cardName}>{item.prenom} {item.nom}</Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash size={22} />
        </TouchableOpacity>
    </View>
)

// ─── Écran Formateurs ─────────────────────────────────────────────────────────

const Formateurs = ({ navigation }: any) => {
    const insets = useSafeAreaInsets()
    const [formateurs, setFormateurs] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [prenom, setPrenom] = useState('')
    const [nom, setNom] = useState('')
    const [email, setEmail] = useState('')
    const [mdp, setMdp] = useState('')
    const [eye, setEye] = useState(false)
    const [date, setDate] = useState(new Date())
    const [dateAffichee, setDateAffichee] = useState('Date de naissance')
    const [dateISO, setDateISO] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [loading, setLoading] = useState(false)

    const chargerFormateurs = async () => {
        try {
            console.log('[Formateurs] GET:', `${ENDPOINTS.PARTICIPANTS}?type=FORMATEUR`)
            const response = await fetch(`${ENDPOINTS.PARTICIPANTS}?type=FORMATEUR`)
            console.log('[Formateurs] Status:', response.status)
            const data = await response.json()
            console.log('[Formateurs] Résultats:', data.length)
            setFormateurs(data)
            setFilteredData(data)
        } catch (error) {
            console.error('[Formateurs] Erreur chargement:', error)
            setTimeout(() => Alert.alert('Erreur réseau', 'Impossible de charger les formateurs.'), 100)
        }
    }

    useEffect(() => { chargerFormateurs() }, [])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (!query.trim()) { setFilteredData(formateurs); return }
        setFilteredData(formateurs.filter(f =>
            `${f.prenom} ${f.nom}`.toLowerCase().includes(query.toLowerCase())
        ))
    }

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (event.type === 'set') {
            const d = selectedDate || date
            setDate(d)
            setDateAffichee(d.toLocaleDateString('fr-FR'))
            setDateISO(d.toISOString().split('T')[0])
        }
    }

    const handleAjouter = async () => {
        console.log('[Formateurs] Ajout:', { prenom, nom, email, dateISO })
        if (!prenom.trim() || !nom.trim() || !email.trim() || !mdp.trim() || !dateISO) {
            setTimeout(() => Alert.alert('Champs manquants', 'Tous les champs sont obligatoires.'), 100)
            return
        }
        setLoading(true)
        try {
            const body = { prenom: prenom.trim(), nom: nom.trim(), email: email.trim(), password: mdp, date_naissance: dateISO }
            console.log('[Formateurs] POST:', ENDPOINTS.FORMATEURS, body)
            const response = await fetch(ENDPOINTS.FORMATEURS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            console.log('[Formateurs] Status POST:', response.status)
            const data = await response.json()
            if (response.ok) {
                setModalVisible(false)
                setPrenom(''); setNom(''); setEmail(''); setMdp('')
                setDateAffichee('Date de naissance'); setDateISO('')
                chargerFormateurs()
                setTimeout(() => Alert.alert('Succès', `Formateur ${prenom} ${nom} ajouté !\nIdentifiants : ${email}`), 300)
            } else {
                setTimeout(() => Alert.alert('Erreur', data.error || 'Impossible d\'ajouter le formateur.'), 100)
            }
        } catch (error) {
            console.error('[Formateurs] Erreur réseau:', error)
            setTimeout(() => Alert.alert('Erreur réseau', 'Vérifie que le back est lancé.'), 100)
        } finally {
            setLoading(false)
        }
    }

    const handleSupprimer = (formateur: any) => {
        setTimeout(() => Alert.alert(
            'Supprimer le formateur',
            `Voulez-vous vraiment supprimer ${formateur.prenom} ${formateur.nom} ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer', style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${ENDPOINTS.PARTICIPANTS}/${formateur.id_utilisateur}`, { method: 'DELETE' })
                            if (response.ok) {
                                chargerFormateurs()
                            } else {
                                const data = await response.json()
                                setTimeout(() => Alert.alert('Erreur', data.error || 'Impossible de supprimer.'), 100)
                            }
                        } catch {
                            setTimeout(() => Alert.alert('Erreur réseau', 'Impossible de contacter le serveur.'), 100)
                        }
                    }
                }
            ]
        ), 100)
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Formateurs</Text>

            <View style={styles.searchSection}>
                <Loupe />
                <TextInput style={styles.searchInput} placeholder="Chercher des formateurs" autoCapitalize='none' autoCorrect={false} value={searchQuery} onChangeText={handleSearch} />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id_utilisateur.toString()}
                renderItem={({ item }) => <FormateurCard item={item} onDelete={() => handleSupprimer(item)} />}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Aucun formateur trouvé</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Ajouter un formateur</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <ArrowLeftPurple />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Ajouter un formateur</Text>
                            <View style={{ width: 30 }} />
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <View style={styles.inputContainer}>
                                <Account height={20} width={20} />
                                <TextInput style={styles.inputModal} placeholder="Prénom" placeholderTextColor="#bbb" value={prenom} onChangeText={setPrenom} />
                            </View>

                            <View style={styles.inputContainer}>
                                <Account height={20} width={20} />
                                <TextInput style={styles.inputModal} placeholder="Nom" placeholderTextColor="#bbb" value={nom} onChangeText={setNom} />
                            </View>

                            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                                <Calendar />
                                <Text style={[styles.inputModal, { color: dateISO ? '#333' : '#bbb' }]}>{dateAffichee}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker value={date} mode="date" display="spinner" onChange={onChangeDate} maximumDate={new Date()} />
                            )}

                            <View style={styles.inputContainer}>
                                <Email />
                                <TextInput style={styles.inputModal} placeholder="Email" placeholderTextColor="#bbb" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            </View>

                            <View style={styles.inputContainer}>
                                <Lock />
                                <TextInput style={styles.inputModal} placeholder="Mot de passe" placeholderTextColor="#bbb" value={mdp} onChangeText={setMdp} secureTextEntry={!eye} />
                                <TouchableOpacity onPress={() => setEye(!eye)}>
                                    <Icon name={eye ? 'eye-outline' : 'eye-off-outline'} color={Colors.primary_blue} size={22} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.6 }]} onPress={handleAjouter} disabled={loading}>
                                <Text style={styles.submitText}>{loading ? 'Envoi...' : 'Valider'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FF' },
    title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary_blue, textAlign: 'center', marginVertical: 16 },
    searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.grey, borderRadius: 10, marginHorizontal: 20, marginBottom: 10, paddingHorizontal: 10 },
    searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 15, color: '#333' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 6, borderRadius: 16, padding: 14, elevation: 3, gap: 12 },
    cardAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.light_blue, justifyContent: 'center', alignItems: 'center' },
    cardAvatarText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary_blue },
    cardName: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
    empty: { alignItems: 'center', paddingTop: 40 },
    emptyText: { color: 'gray', fontSize: 15 },
    addButton: { position: 'absolute', bottom: 100, left: 30, right: 30, backgroundColor: Colors.primary_blue, padding: 15, borderRadius: 30, alignItems: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '88%', backgroundColor: '#fff', borderRadius: 17, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary_blue },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6D6F2', borderRadius: 30, paddingHorizontal: 15, height: 45, marginBottom: 14 },
    inputModal: { flex: 1, marginLeft: 10, color: '#333', fontSize: 14 },
    submitButton: { backgroundColor: Colors.primary_blue, padding: 14, borderRadius: 30, alignItems: 'center', marginTop: 6, marginBottom: 10 },
    submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
})

export default Formateurs
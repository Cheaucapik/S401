import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ArrowLeftPurple from '../components/ArrowLeftPurple'
import Markdown from 'react-native-markdown-display'
import { ENDPOINTS } from '../config/api'
import DateTimePicker from '@react-native-community/datetimepicker'
import Calendar from '../components/Calendar'
import Rond from '../components/Rond'

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const formatHeure = (dateStr: string) => new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const SessionCard = ({ session, colorTitle }: { session: any; colorTitle: string }) => (
    <View style={styles.sessionCard}>
        <Text style={styles.sessionDate}>{formatDate(session.date_deb)}</Text>
        <View style={styles.sessionRow}>
            <Rond color={session.presentiel ? Colors.green : Colors.red} />
            <Text style={styles.sessionInfo}>{session.presentiel ? 'Présentiel' : 'En ligne'}</Text>
            <Text style={[styles.sessionBadge, { backgroundColor: colorTitle }]}>
                {formatHeure(session.date_deb)} - {formatHeure(session.date_fin)}
            </Text>
        </View>
        <Text style={styles.sessionFormateur}>
            Formateur : {session.formateur?.utilisateur?.prenom ?? 'Non précisé'} {session.formateur?.utilisateur?.nom ?? ''}
        </Text>
    </View>
)

const FormationAdmin = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets()
    const { formation, axe } = route.params ?? {}

    const [sessions, setSessions] = useState<any[]>([])
    const [formateurs, setFormateurs] = useState<any[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date())
    const [dateAffichee, setDateAffichee] = useState('Date de créneau')
    const [dateISO, setDateISO] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [heureDebut, setHeureDebut] = useState('')
    const [heureFin, setHeureFin] = useState('')
    const [formateurId, setFormateurId] = useState<number | null>(null)
    const [presentiel, setPresentiel] = useState(true)

    if (!formation || !axe) return null

    const dureeFormation = formation.duration ?? 0

    const chargerSessions = async () => {
        try {
            const response = await fetch(`${ENDPOINTS.SESSIONS}?idFormation=${formation.id_formation}`)
            const data = await response.json()
            const now = new Date()
            const futures = data
                .filter((s: any) => new Date(s.date_deb) >= now)
                .sort((a: any, b: any) => new Date(a.date_deb).getTime() - new Date(b.date_deb).getTime())
            setSessions(futures)
        } catch (error) {
            console.error('[FormationAdmin] Erreur sessions:', error)
        }
    }

    const chargerFormateurs = async () => {
        try {
            const response = await fetch(`${ENDPOINTS.PARTICIPANTS}?type=FORMATEUR`)
            const data = await response.json()
            setFormateurs(data)
            if (data.length > 0) setFormateurId(data[0].id_utilisateur)
        } catch (error) {
            console.error('[FormationAdmin] Erreur formateurs:', error)
        }
    }

    useEffect(() => {
        chargerSessions()
        chargerFormateurs()
    }, [])

    // Jours déjà occupés (une seule session par jour)
    const datesOccupees = sessions.map(s => new Date(s.date_deb).toDateString())

    const onChangeHeureDebut = (val: string) => {
        setHeureDebut(val)
        const debut = parseInt(val)
        if (!isNaN(debut)) {
            const fin = debut + dureeFormation
            setHeureFin(fin.toString())
        } else {
            setHeureFin('')
        }
    }

    const onChangeHeureFin = (val: string) => {
        setHeureFin(val)
        const fin = parseInt(val)
        if (!isNaN(fin)) {
            const debut = fin - dureeFormation
            setHeureDebut(debut.toString())
        } else {
            setHeureDebut('')
        }
    }

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate)
            setDateAffichee(selectedDate.toLocaleDateString('fr-FR'))
            setDateISO(selectedDate.toISOString().split('T')[0])
        }
    }

    const handleAjouterSession = async () => {
        const debut = parseInt(heureDebut)
        const fin = parseInt(heureFin)

        if (!dateISO) { setTimeout(() => Alert.alert('Erreur', 'Choisissez une date.'), 100); return }
        if (isNaN(debut) || isNaN(fin)) { setTimeout(() => Alert.alert('Erreur', 'Entrez des heures valides.'), 100); return }
        if (debut < 7) { setTimeout(() => Alert.alert('Erreur', 'L\'heure de début doit être ≥ 7h.'), 100); return }
        if (fin > 22) { setTimeout(() => Alert.alert('Erreur', 'L\'heure de fin doit être ≤ 22h.'), 100); return }
        if (fin <= debut) { setTimeout(() => Alert.alert('Incohérent', 'L\'heure de fin doit être > heure de début.'), 100); return }
        if (fin - debut !== dureeFormation) { setTimeout(() => Alert.alert('Incohérent', `La durée doit être exactement ${dureeFormation}h.`), 100); return }
        if (!formateurId) { setTimeout(() => Alert.alert('Erreur', 'Sélectionnez un formateur.'), 100); return }
        if (datesOccupees.includes(new Date(dateISO + 'T12:00:00').toDateString())) {
            setTimeout(() => Alert.alert('Erreur', 'Une session existe déjà pour ce jour.'), 100); return
        }

        setLoading(true)
        try {
            const dateDebut = new Date(`${dateISO}T${String(debut).padStart(2, '0')}:00:00`)
            const dateFin = new Date(`${dateISO}T${String(fin).padStart(2, '0')}:00:00`)

            const body = {
                date_deb: dateDebut.toISOString(),
                date_fin: dateFin.toISOString(),
                presentiel,
                lieu: presentiel ? 'À définir' : 'En ligne',
                idFormation: formation.id_formation,
                idFormateur: formateurId,
            }
            console.log('[FormationAdmin] POST session:', body)
            const response = await fetch(ENDPOINTS.SESSIONS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await response.json()
            if (response.ok) {
                setModalVisible(false)
                setDateISO(''); setDateAffichee('Date de créneau'); setHeureDebut(''); setHeureFin('')
                chargerSessions()
                setTimeout(() => Alert.alert('Succès', 'Session ajoutée !'), 300)
            } else {
                setTimeout(() => Alert.alert('Erreur', data.error || 'Impossible d\'ajouter.'), 100)
            }
        } catch (error) {
            console.error('[FormationAdmin] Erreur réseau:', error)
            setTimeout(() => Alert.alert('Erreur réseau', 'Vérifie que le back est lancé.'), 100)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftPurple />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Formation</Text>
                <View style={{ width: 30 }} />
            </View>

            <Image source={{ uri: formation.image }} style={styles.image} />

            <View style={styles.infoRow}>
                <Text style={styles.titre}>{formation.title}</Text>
                <View style={styles.badges}>
                    <Text style={[styles.badge, { backgroundColor: axe.colorTitle }]}>Durée : {formation.duration}h</Text>
                    <View style={styles.presentielRow}>
                        <View style={[styles.dot, { backgroundColor: formation.presentiel ? Colors.red : Colors.green }]} />
                        <Text style={styles.presentielText}>{formation.presentiel ? 'Présentiel' : 'En ligne'}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Présentation de la formation</Text>
            <Markdown style={markdownStyles}>{formation.description}</Markdown>

            <Text style={styles.sectionTitle}>Sessions</Text>
            {sessions.length === 0 ? (
                <Text style={styles.noSession}>Il n'y a aucune session pour cette formation</Text>
            ) : (
                sessions.map(s => <SessionCard key={s.id_session} session={s} colorTitle={axe.colorTitle} />)
            )}

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Ajouter une session</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <ArrowLeftPurple />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Ajouter une session</Text>
                            <View style={{ width: 30 }} />
                        </View>

                        <ScrollView keyboardShouldPersistTaps="handled">

                            {/* Date */}
                            <Text style={styles.label}>Choisissez votre date :</Text>
                            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                                <Calendar />
                                <Text style={[styles.inputModal, { color: dateISO ? '#333' : '#bbb' }]}>{dateAffichee}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={onChangeDate}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* Créneaux */}
                            <Text style={styles.label}>Choisissez votre créneau :</Text>
                            <Text style={styles.hint}>Durée fixe : {dureeFormation}h — l'autre champ se calcule automatiquement</Text>
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                                <View style={[styles.inputContainer, { flex: 1 }]}>
                                    <TextInput
                                        style={styles.inputModal}
                                        placeholder="Début"
                                        placeholderTextColor="#bbb"
                                        value={heureDebut}
                                        onChangeText={onChangeHeureDebut}
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                </View>
                                <View style={[styles.inputContainer, { flex: 1 }]}>
                                    <TextInput
                                        style={styles.inputModal}
                                        placeholder="Fin"
                                        placeholderTextColor="#bbb"
                                        value={heureFin}
                                        onChangeText={onChangeHeureFin}
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                </View>
                            </View>

                            {/* Formateur */}
                            <Text style={styles.label}>Formateur :</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                                {formateurs.map(f => (
                                    <TouchableOpacity
                                        key={f.id_utilisateur}
                                        style={[styles.chip, formateurId === f.id_utilisateur && styles.chipSelected]}
                                        onPress={() => setFormateurId(f.id_utilisateur)}
                                    >
                                        <Text style={[styles.chipText, formateurId === f.id_utilisateur && { color: '#fff' }]}>
                                            {f.prenom} {f.nom}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Modalité */}
                            <Text style={styles.label}>Modalité :</Text>
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={[styles.chip, { flex: 1, justifyContent: 'center' }, presentiel && styles.chipSelected]}
                                    onPress={() => setPresentiel(true)}
                                >
                                    <Text style={[styles.chipText, presentiel && { color: '#fff' }]}>Présentiel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.chip, { flex: 1, justifyContent: 'center' }, !presentiel && styles.chipSelected]}
                                    onPress={() => setPresentiel(false)}
                                >
                                    <Text style={[styles.chipText, !presentiel && { color: '#fff' }]}>En ligne</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, loading && { opacity: 0.6 }]}
                                onPress={handleAjouterSession}
                                disabled={loading}
                            >
                                <Text style={styles.submitText}>{loading ? 'Envoi...' : 'Valider'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', padding: 20, flexGrow: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary_blue },
    image: { width: '100%', height: 200, borderRadius: 20, marginBottom: 16, backgroundColor: '#eee' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, flex: 1, marginRight: 10 },
    badges: { alignItems: 'flex-end', gap: 8 },
    badge: { color: 'white', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    presentielRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    presentielText: { fontSize: 13, fontWeight: 'bold' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 16, color: Colors.primary_blue },
    noSession: { color: 'gray', fontSize: 14, fontStyle: 'italic', marginBottom: 16 },
    sessionCard: { backgroundColor: '#F0EBFF', borderRadius: 12, padding: 12, marginBottom: 10 },
    sessionDate: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6, textTransform: 'capitalize' },
    sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    sessionInfo: { fontSize: 13, color: '#555' },
    sessionBadge: { color: 'white', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    sessionFormateur: { fontSize: 12, color: 'gray', marginTop: 2 },
    addButton: { backgroundColor: Colors.primary_blue, padding: 14, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 30 },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '88%', backgroundColor: '#fff', borderRadius: 17, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary_blue },
    label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
    hint: { fontSize: 11, color: 'gray', marginBottom: 8, fontStyle: 'italic' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6D6F2', borderRadius: 30, paddingHorizontal: 15, height: 42, marginBottom: 14 },
    inputModal: { flex: 1, marginLeft: 6, color: '#333', fontSize: 14 },
    chip: { backgroundColor: '#E6D6F2', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, alignItems: 'center' },
    chipSelected: { backgroundColor: Colors.primary_blue },
    chipText: { fontSize: 13, color: Colors.primary_blue, fontWeight: '500' },
    submitButton: { backgroundColor: Colors.primary_blue, padding: 14, borderRadius: 30, alignItems: 'center', marginTop: 4 },
    submitText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
})

const markdownStyles = {
    body: { fontSize: 14, lineHeight: 22, color: '#333' },
    heading2: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 12, marginBottom: 6 },
    blockquote: { borderLeftWidth: 3, borderLeftColor: Colors.primary_blue, paddingLeft: 10, color: 'gray' },
}

export default FormationAdmin
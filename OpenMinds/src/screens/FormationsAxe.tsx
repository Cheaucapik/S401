import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ArrowLeftPurple from '../components/ArrowLeftPurple'
import { ENDPOINTS } from '../config/api'
import File from '../components/File'
import Descr from '../components/Descr'
import Modalite from '../components/Modalite'
import Trash from '../components/Trash'
import { Picker } from '@react-native-picker/picker'

// ─── Carte formation ──────────────────────────────────────────────────────────

const FormationCard = ({ item, color, colorTitle, onPress, onDelete }: {
    item: any; color: string; colorTitle: string; onPress: () => void; onDelete: () => void
}) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text numberOfLines={1} style={[styles.cardTitle, { backgroundColor: colorTitle }]}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.cardDesc}>{item.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.cardInfo}>Durée : {item.duration}h</Text>
                <View style={styles.cardDot}>
                    <View style={[styles.dot, { backgroundColor: item.presentiel ? '#e74c3c' : '#2ecc71' }]} />
                    <Text style={styles.cardInfo}>{item.presentiel ? 'Présentiel' : 'En ligne'}</Text>
                </View>
            </View>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Trash size={22} />
        </TouchableOpacity>
    </TouchableOpacity>
)

// ─── Écran principal ──────────────────────────────────────────────────────────

const FormationsAxe = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets()
    const { axe } = route.params

    const [formations, setFormations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [nom, setNom] = useState('')
    const [description, setDescription] = useState('')
    const [duree, setDuree] = useState('')
    const [modalite, setModalite] = useState('presentiel')

    const dureeTotal = formations.reduce((acc, f) => acc + (f.duration ?? 0), 0)

    const chargerFormations = async () => {
        try {
            console.log('[FormationsAxe] GET formations axe id:', axe.id_thematique)
            const response = await fetch(`${ENDPOINTS.FORMATIONS}?id=${axe.id_thematique}`)
            console.log('[FormationsAxe] Status:', response.status)
            const data = await response.json()
            console.log('[FormationsAxe] Formations:', data.length)
            setFormations(data)
        } catch (error) {
            console.error('[FormationsAxe] Erreur chargement:', error)
            Alert.alert('Erreur réseau', 'Impossible de charger les formations.')
        }
    }

    useEffect(() => { chargerFormations() }, [])

    // ─── Suppression formation ────────────────────────────────────────────────

    const handleSupprimerFormation = (formation: any) => {
        Alert.alert(
            'Supprimer la formation',
            `Voulez-vous vraiment supprimer "${formation.title}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer', style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('[FormationsAxe] DELETE formation id:', formation.id_formation)
                            const url = `${ENDPOINTS.FORMATIONS}/${formation.id_formation}`
                            console.log('[FormationsAxe] URL DELETE:', url)
                            const response = await fetch(url, { method: 'DELETE' })
                            console.log('[FormationsAxe] Status DELETE:', response.status)
                            if (response.ok) {
                                chargerFormations()
                            } else {
                                const data = await response.json()
                                Alert.alert('Erreur', data.error || 'Impossible de supprimer.')
                            }
                        } catch (error) {
                            console.error('[FormationsAxe] Erreur suppression:', error)
                            Alert.alert('Erreur réseau', 'Impossible de contacter le serveur.')
                        }
                    }
                }
            ]
        )
    }

    // ─── Ajout formation ──────────────────────────────────────────────────────

    const handleAjouter = async () => {
        console.log('[FormationsAxe] Ajout:', { nom, description, duree, modalite })
        if (!nom.trim() || !description.trim() || !duree.trim()) {
            Alert.alert('Champs manquants', 'Nom, description et durée sont obligatoires.')
            return
        }
        const dureeInt = parseInt(duree)
        if (isNaN(dureeInt) || dureeInt <= 0) {
            Alert.alert('Durée invalide', 'La durée doit être un nombre entier positif.')
            return
        }
        setLoading(true)
        try {
            const body = {
                title: nom.trim(),
                description: description.trim(),
                duration: dureeInt,
                presentiel: modalite === 'presentiel',
                numero: formations.length + 1,
                thematiqueId: axe.id_thematique,
                image: 'default',
            }
            console.log('[FormationsAxe] POST:', body)
            const response = await fetch(ENDPOINTS.FORMATIONS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            console.log('[FormationsAxe] Status POST:', response.status)
            const data = await response.json()
            if (response.ok) {
                Alert.alert('Succès', 'Formation ajoutée !')
                setModalVisible(false)
                setNom(''); setDescription(''); setDuree(''); setModalite('presentiel')
                chargerFormations()
            } else {
                Alert.alert('Erreur', data.error || 'Impossible d\'ajouter la formation.')
            }
        } catch (error) {
            console.error('[FormationsAxe] Erreur réseau ajout:', error)
            Alert.alert('Erreur réseau', 'Vérifie que le back est lancé.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftPurple />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Axes</Text>
                <View style={{ width: 30 }} />
            </View>

            {/* Titre axe */}
            <Text style={styles.titre}>Axe : {axe.title}</Text>
            <Text style={styles.sousTitre}>{axe.description}</Text>
            <Text style={styles.dureeTotal}>Durée totale : {dureeTotal}h</Text>

            {/* Liste */}
            <FlatList
                data={formations}
                keyExtractor={(item) => item.id_formation.toString()}
                renderItem={({ item }) => (
                    <FormationCard
                        item={item}
                        color={axe.color}
                        colorTitle={axe.colorTitle}
                        onPress={() => navigation.navigate('FormationAdmin', { formation: item, axe })}
                        onDelete={() => handleSupprimerFormation(item)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Aucune formation pour cet axe</Text>
                    </View>
                }
            />

            {/* Bouton ajouter */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Ajouter une formation</Text>
            </TouchableOpacity>

            {/* Modal ajout */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <ArrowLeftPurple />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Ajouter une formation</Text>
                            <View style={{ width: 30 }} />
                        </View>

                        <View style={styles.inputContainer}>
                            <File />
                            <TextInput style={styles.inputModal} placeholder="Nom" placeholderTextColor="#bbb" value={nom} onChangeText={setNom} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Descr />
                            <TextInput style={styles.inputModal} placeholder="Description" placeholderTextColor="#bbb" value={description} onChangeText={setDescription} />
                        </View>

                        <View style={styles.inputContainer}>
                            <Modalite />
                            <TextInput style={styles.inputModal} placeholder="Durée (en heures)" placeholderTextColor="#bbb" value={duree} onChangeText={setDuree} keyboardType="numeric" />
                        </View>

                        <View style={[styles.inputContainer, { height: 45 }]}>
                            <Modalite />
                            <Picker selectedValue={modalite} onValueChange={(v) => setModalite(v)} style={{ flex: 1, color: '#555' }}>
                                <Picker.Item label="Présentiel" value="presentiel" />
                                <Picker.Item label="En ligne" value="distanciel" />
                            </Picker>
                        </View>

                        <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.6 }]} onPress={handleAjouter} disabled={loading}>
                            <Text style={styles.submitText}>{loading ? 'Envoi...' : '+ Ajouter une formation'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.fermer}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F6FF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary_blue },
    titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black, marginHorizontal: 20, marginTop: 4 },
    sousTitre: { fontSize: 13, color: 'gray', marginHorizontal: 20, marginTop: 4 },
    dureeTotal: { fontSize: 13, color: Colors.primary_blue, fontWeight: '600', marginHorizontal: 20, marginTop: 4, marginBottom: 4 },
    empty: { flex: 1, alignItems: 'center', paddingTop: 40 },
    emptyText: { color: 'gray', fontSize: 15 },
    card: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 8, borderRadius: 16, padding: 12, elevation: 3 },
    cardImage: { width: 65, height: 65, borderRadius: 32, backgroundColor: '#ddd', marginRight: 12 },
    cardContent: { flex: 1, gap: 4 },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
    cardDesc: { fontSize: 11, color: '#555' },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardInfo: { fontSize: 11, color: '#333' },
    cardDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    addButton: { position: 'absolute', bottom: 20, left: 30, right: 30, backgroundColor: Colors.primary_blue, padding: 15, borderRadius: 30, alignItems: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '88%', backgroundColor: '#fff', borderRadius: 17, padding: 20 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary_blue },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6D6F2', borderRadius: 30, paddingHorizontal: 15, height: 40, marginBottom: 14 },
    inputModal: { flex: 1, marginLeft: 10, color: '#333' },
    submitButton: { backgroundColor: Colors.primary_blue, padding: 12, borderRadius: 30, alignItems: 'center', marginTop: 6 },
    submitText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    fermer: { textAlign: 'center', marginTop: 12, color: '#666' },
})

export default FormationsAxe
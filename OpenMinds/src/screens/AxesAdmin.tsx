import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Alert, PanResponder } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
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
import Descr from '../components/Descr'

// ─── Utilitaires couleur ──────────────────────────────────────────────────

function hsvToHex(h: number, s: number, v: number): string {
    const f = (n: number) => {
        const k = (n + h / 60) % 6
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    }
    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
    return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`
}

function darkenHex(hex: string, factor = 0.45): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const toHex = (x: number) => Math.round(x * (1 - factor)).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// ─── Color Picker HSV ─────────────────────────────────────────────────────

const PICKER_W = 260
const PICKER_H = 160
const HUE_H = 18

const ColorPickerHSV = ({ onChange }: { onChange: (hex: string) => void }) => {
    const [hue, setHue] = useState(220)
    const [sat, setSat] = useState(0.55)
    const [val, setVal] = useState(0.75)

    const emitColor = useCallback((h: number, s: number, v: number) => {
        onChange(hsvToHex(h, s, v))
    }, [onChange])

    const svResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
            const s = Math.min(1, Math.max(0, e.nativeEvent.locationX / PICKER_W))
            const v = Math.min(1, Math.max(0, 1 - e.nativeEvent.locationY / PICKER_H))
            setSat(s); setVal(v); emitColor(hue, s, v)
        },
        onPanResponderMove: (e) => {
            const s = Math.min(1, Math.max(0, e.nativeEvent.locationX / PICKER_W))
            const v = Math.min(1, Math.max(0, 1 - e.nativeEvent.locationY / PICKER_H))
            setSat(s); setVal(v); emitColor(hue, s, v)
        },
    })).current

    const hueResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
            const h = Math.min(360, Math.max(0, e.nativeEvent.locationX / PICKER_W * 360))
            setHue(h); emitColor(h, sat, val)
        },
        onPanResponderMove: (e) => {
            const h = Math.min(360, Math.max(0, e.nativeEvent.locationX / PICKER_W * 360))
            setHue(h); emitColor(h, sat, val)
        },
    })).current

    const currentHex = hsvToHex(hue, sat, val)
    const hueColor = hsvToHex(hue, 1, 1)

    return (
        <View style={pickerStyle.container}>
            {/* Carré SV */}
            <View style={pickerStyle.svWrapper} {...svResponder.panHandlers}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: hueColor }]} />
                <LinearGradient style={StyleSheet.absoluteFill} colors={['#fff', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                <LinearGradient style={StyleSheet.absoluteFill} colors={['transparent', '#000']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
                <View style={[pickerStyle.svCursor, { left: sat * PICKER_W - 8, top: (1 - val) * PICKER_H - 8 }]} />
            </View>

            {/* Barre teinte */}
            <View style={pickerStyle.hueWrapper} {...hueResponder.panHandlers}>
                <LinearGradient style={StyleSheet.absoluteFill} colors={['#f00','#ff0','#0f0','#0ff','#00f','#f0f','#f00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                <View style={[pickerStyle.hueCursor, { left: hue / 360 * PICKER_W - 7 }]} />
            </View>

            {/* Aperçu */}
            <View style={pickerStyle.preview}>
                <View style={[pickerStyle.previewDot, { backgroundColor: currentHex }]} />
                <Text style={pickerStyle.previewText}># {currentHex.slice(1).toUpperCase()}</Text>
            </View>
        </View>
    )
}

const pickerStyle = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 8 },
    svWrapper: { width: PICKER_W, height: PICKER_H, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
    svCursor: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#fff' },
    hueWrapper: { width: PICKER_W, height: HUE_H, borderRadius: 9, overflow: 'hidden', marginBottom: 10 },
    hueCursor: { position: 'absolute', top: 1, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
    preview: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    previewDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#ccc' },
    previewText: { fontSize: 13, fontWeight: '600', color: '#444' },
})

// ─── Écran AxesAdmin ──────────────────────────────────────────────────────

const AxesAdmin = ({ navigation }: any) => {
    const insets = useSafeAreaInsets()
    const [visible, setVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [formations, setFormations] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [nom, setNom] = useState('')
    const [description, setDescription] = useState('')
    const [couleur, setCouleur] = useState('#E8E7FE')
    const [couleurTitre, setCouleurTitre] = useState('#5A4DB2')
    const [loading, setLoading] = useState(false)

    const handleCouleurChange = (hex: string) => {
        setCouleur(hex)
        setCouleurTitre(darkenHex(hex))
    }

    const chargerAxes = async () => {
        try {
            console.log('[AxesAdmin] GET:', ENDPOINTS.THEMATIQUES)
            const response = await fetch(ENDPOINTS.THEMATIQUES)
            console.log('[AxesAdmin] Status:', response.status)
            const data = await response.json()
            console.log('[AxesAdmin] Axes:', data.length)
            setFormations(data)
        } catch (error) {
            console.error('[AxesAdmin] Erreur chargement:', error)
            Alert.alert('Erreur réseau', 'Impossible de charger les axes.\nVérifie que le back est lancé et l\'IP dans api.ts.')
        }
    }

    useEffect(() => { chargerAxes() }, [])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setFilteredData(formations.filter(item => item.title.toLowerCase().includes(query.toLowerCase())))
    }

    const handleAjouterAxe = async () => {
        console.log('[AxesAdmin] Ajout:', { nom, description, couleur, couleurTitre })
        if (!nom.trim() || !description.trim()) {
            Alert.alert('Champs manquants', 'Le nom et la description sont obligatoires.')
            return
        }
        setLoading(true)
        try {
            const body = { title: nom.trim(), description: description.trim(), color: couleur, colorTitle: couleurTitre, image: 'default' }
            console.log('[AxesAdmin] POST:', ENDPOINTS.THEMATIQUES, body)
            const response = await fetch(ENDPOINTS.THEMATIQUES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            console.log('[AxesAdmin] Status POST:', response.status)
            const data = await response.json()
            console.log('[AxesAdmin] Réponse:', data)
            if (response.ok) {
                Alert.alert('Succès', 'Axe ajouté !')
                setVisible(false)
                setNom(''); setDescription(''); setCouleur('#E8E7FE'); setCouleurTitre('#5A4DB2')
                chargerAxes()
            } else {
                Alert.alert('Erreur serveur', data.error || 'Impossible d\'ajouter l\'axe.')
            }
        } catch (error) {
            console.error('[AxesAdmin] Erreur réseau ajout:', error)
            Alert.alert('Erreur réseau', 'Impossible de contacter le serveur.\nVérifie l\'IP dans api.ts et que npm run dev est lancé.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <LinearGradient style={styles.container} colors={[Colors.purple, Colors.light_pink]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View style={[{ marginTop: insets.top, marginBottom: 20 }, styles.header]}>
                        <Text style={styles.title}>Axes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Account />
                        </TouchableOpacity>
                    </View>
                    <MascotteForma style={styles.mascotte} />
                    <View style={styles.searchSection}>
                        <Loupe />
                        <TextInput style={styles.input} autoCapitalize='none' placeholder="Chercher des axes" autoCorrect={false} value={searchQuery} onChangeText={handleSearch} />
                    </View>
                </LinearGradient>
            </View>

            <View style={{ flex: 3 }}>
                <FlatList
                    data={searchQuery !== '' ? filteredData : formations}
                    keyExtractor={(item) => item.id_thematique.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('FormationsAxe', { axe: item })}>
                            <ThematiqueTemplate
                                color={item.color}
                                colorTitle={item.colorTitle}
                                title={item.title}
                                duration={item.totalDuration ?? '0'}
                                total={item._count?.formations ?? 0}
                                image={item.image}
                                description={item.description}
                                id_thematique={item.id_thematique}
                                progression={item.progression ?? 0}
                                isAdmin={true}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                            <Text style={{ fontSize: 16, color: 'gray' }}>Aucun axe trouvé</Text>
                        </View>
                    }
                />
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Text style={styles.addAxe}>+ Ajouter un axe</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.containerModal}>

                            <View style={styles.inputContainer}>
                                <File />
                                <TextInput style={styles.inputModal} placeholder="Nom" placeholderTextColor="#fff" value={nom} onChangeText={setNom} />
                            </View>

                            <View style={styles.inputContainer}>
                                <Descr />
                                <TextInput style={styles.inputModal} placeholder="Description" placeholderTextColor="#fff" value={description} onChangeText={setDescription} />
                            </View>

                            <Text style={styles.pickerLabel}>Choisissez la couleur de l'axe</Text>
                            <ColorPickerHSV onChange={handleCouleurChange} />

                            {/* Aperçu */}
                            <View style={[styles.apercu, { backgroundColor: couleur }]}>
                                <Text style={[styles.apercuText, { color: couleurTitre }]}>
                                    {nom || 'Nom de l\'axe'}
                                </Text>
                            </View>

                            <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleAjouterAxe} disabled={loading}>
                                <Text style={styles.buttonText}>{loading ? 'Envoi...' : '+ Ajouter un axe'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { borderBottomRightRadius: 30, borderBottomLeftRadius: 30, paddingBottom: 10, marginBottom: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 },
    title: { fontSize: 40, fontWeight: 'bold', color: Colors.white },
    mascotte: { alignSelf: 'center' },
    searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.grey, borderRadius: 10, marginLeft: 10, marginRight: 10, marginBottom: 10, paddingHorizontal: 10 },
    input: { backgroundColor: Colors.white, margin: 5, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, flex: 1, paddingVertical: 10, color: '#424242' },
    addAxe: { paddingHorizontal: 30, paddingVertical: 10, backgroundColor: Colors.primary_blue, color: Colors.white, fontWeight: 'bold', fontSize: 20, borderRadius: 30, margin: 60, textAlign: 'center' },
    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '88%', backgroundColor: '#fff', borderRadius: 17, padding: 10, maxHeight: '90%' },
    containerModal: { padding: 16, marginTop: 6 },
    inputModal: { flex: 1, marginLeft: 10, color: 'white', fontWeight: 'bold' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6D6F2', borderRadius: 30, paddingHorizontal: 15, height: 40, marginBottom: 14 },
    button: { backgroundColor: Colors.primary_blue, padding: 8, borderRadius: 30, alignItems: 'center', marginTop: 10, height: 40 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
    pickerLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    apercu: { borderRadius: 12, padding: 10, marginBottom: 4, alignItems: 'center', marginTop: 8 },
    apercuText: { fontWeight: 'bold', fontSize: 15 },
})

export default AxesAdmin
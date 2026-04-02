import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ArrowLeftPurple from '../components/ArrowLeftPurple'
import Markdown from 'react-native-markdown-display'

const FormationAdmin = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets()
    const { formation, axe } = route.params

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftPurple />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Axes</Text>
                <View style={{ width: 30 }} />
            </View>

            {/* Image */}
            <Image source={{ uri: formation.image }} style={styles.image} />

            {/* Titre + infos */}
            <View style={styles.infoRow}>
                <Text style={styles.titre}>{formation.title}</Text>
                <View style={styles.badges}>
                    <Text style={[styles.badge, { backgroundColor: axe.colorTitle }]}>
                        Durée : {formation.duration}h
                    </Text>
                    <View style={styles.presentielRow}>
                        <View style={[styles.dot, { backgroundColor: formation.presentiel ? Colors.red : Colors.green }]} />
                        <Text style={styles.presentielText}>{formation.presentiel ? 'Présentiel' : 'En ligne'}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Présentation de la formation</Text>

            {/* Description Markdown */}
            <Markdown style={markdownStyles}>
                {formation.description}
            </Markdown>

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
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
})

const markdownStyles = {
    body: { fontSize: 14, lineHeight: 22 },
    heading2: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
    blockquote: { borderLeftWidth: 3, borderLeftColor: Colors.primary_blue, paddingLeft: 10, color: 'gray' },
}

export default FormationAdmin
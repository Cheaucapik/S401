import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ArrowLeftPurple from '../components/ArrowLeftPurple'

const FormationAdmin = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets()
    const { formation, axe } = route.params

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftPurple />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Axes</Text>
                <View style={{ width: 30 }} />
            </View>

            <Text style={styles.titre}>{formation.title}</Text>
            <Text style={styles.sousTitre}>{formation.description}</Text>

            {/* La suite sera ajoutée ici */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary_blue },
    titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginHorizontal: 20, marginTop: 10 },
    sousTitre: { fontSize: 14, color: 'gray', marginHorizontal: 20, marginTop: 6 },
})

export default FormationAdmin
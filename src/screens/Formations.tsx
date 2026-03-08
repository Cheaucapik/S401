import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity} from 'react-native'
import React from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteFormat from '../components/MascotteForma'
import Account from '../components/Account'

const Formations = ({navigation}:any) => {
    const insets = useSafeAreaInsets();
    return (
        <LinearGradient style={styles.container}
            colors={[Colors.purple, Colors.light_pink]} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 0, y: 1 }}
            >
            <View style={[{ marginTop: insets.top, marginBottom : 20 }, styles.header]}>
                <Text style={styles.title}>Formations</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Account />
                </TouchableOpacity>
            </View>
            <MascotteFormat style={styles.mascotte} />
            <View style={styles.searchSection}>
                <Loupe />
                <TextInput
                    style={styles.input}
                    placeholder="Chercher des formations"
                    underlineColorAndroid="transparent"
                />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, 
        maxHeight: 225,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    title: { fontSize: 40, fontWeight: 'bold', color: Colors.white },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
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
    mascotte: {
        alignSelf: 'center',
    },
    header : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
})

export default Formations
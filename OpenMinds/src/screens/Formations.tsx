import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteFormat from '../components/MascotteForma'
import Account from '../components/Account'
import FormationTemplate from '../components/FormationTemplate'

const Formations = ({navigation}:any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const chargerFormations = async () => {
        const response = await fetch('http://192.168.1.147:3000/api/formations');
        const data = await response.json();
        setFormations(data);
    };

    useEffect(() => {
        chargerFormations();
     }, []);

    const handleSearch = (query : string) => {
        setSearchQuery(query);
        const newData = formations.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(newData);
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
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
                            autoCapitalize='none'
                            placeholder="Chercher des formations"
                            autoCorrect={false}
                            value={searchQuery}
                            onChangeText={(query) => handleSearch(query)}
                        />
                    </View>
                </LinearGradient>
            </View>

            <View style={{ flex: 3 }}>
                {searchQuery !== '' ? (<FlatList
                data={filteredData}
                keyExtractor={(item) => item.id_formation.toString()}
                renderItem={({ item } : { item: any }) => (
                    <FormationTemplate color={item.thematique.color} colorTitle={item.thematique.colorTitle} title={item.title} duration={item.duration} numero={item.numero} presentiel={item.presentiel} total={item.thematique._count.formations} axe_title={item.thematique.title} image={item.image} id={item.id_formation} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}
                
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ fontSize: 18, color: 'gray' }}>Aucune formation trouvée</Text>
                    </View>
                }

                persistentScrollbar={true}
                bounces={true}
            />) : (
                <View>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', margin: 20 }}>Continuer...</Text>
                </View>
            )}
            
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        paddingBottom: 10,
        marginBottom: 10,
    },
    title: { fontSize: 40, fontWeight: 'bold', color: Colors.white },
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
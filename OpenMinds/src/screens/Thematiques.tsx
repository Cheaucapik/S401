import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteFormat from '../components/MascotteForma'
import Account from '../components/Account'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Thematiques = ({navigation}:any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [formationsContinuer, setFormationsContinuer] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const chargerThematiques = async () => {
        const user = await AsyncStorage.getItem('userData');
        const userId = user ? JSON.parse(user).id : null;

        const [responseThema, responseThemaContinuer] = await Promise.all([
            fetch(`${ENDPOINTS.THEMATIQUES}`),
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}`)  
        ]);
        const dataThema = await responseThema.json();
        const dataThemaContinuer = await responseThemaContinuer.json();

        setFormations(dataThema);
        setFormationsContinuer(dataThemaContinuer);
    };

    useEffect(() => {
        chargerThematiques();
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
                        <Text style={styles.title}>Thématiques</Text>
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
                            placeholder="Chercher des thématiques"
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
                keyExtractor={(item) => item.id_thematique.toString()}
                renderItem={({ item } : { item: any }) => (
                    <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}
                
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ fontSize: 18, color: 'gray' }}>Aucune thématique trouvée</Text>
                    </View>
                }

                persistentScrollbar={true}
                bounces={true}
            />) : (
                <View>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginHorizontal: 20 }}>Continuer...</Text>
                    <View>
                    <FlatList
                        data={formationsContinuer}
                        keyExtractor={(item) => item.id_thematique.toString()}
                        renderItem={({ item } : { item: any }) => (
                            <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} />
                        )}
                        />
                    </View>
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

export default Thematiques
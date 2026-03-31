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
    const [formationsNonCommence, setFormationsNonCommence] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [allFormations, setAllFormations] = useState(false);

    const chargerThematiques = async () => {

        const user = await AsyncStorage.getItem('userData');
        const userId = user ? JSON.parse(user).id : null;

        const [responseThema, responseThemaContinuer, responseThemaNonCommence] = await Promise.all([
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}`),
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}&statut=continuer`),
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}&statut=decouvrir`),  
        ]);
        const dataThema = await responseThema.json();
        const dataThemaContinuer = await responseThemaContinuer.json();
        const dataThemaNonCommence = await responseThemaNonCommence.json();

        setFormations(dataThema);
        setFilteredData(dataThema);
        setFormationsContinuer(dataThemaContinuer);
        setFormationsNonCommence(dataThemaNonCommence);
        
    };

    useEffect(() => {
        chargerThematiques();
     }, []);

    useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        setAllFormations(false);
        setSearchQuery('');
        setFilteredData(formations);
    });
    return unsubscribe;
    }, [navigation, formations]);

    const handleSearch = (query : string) => {
        setSearchQuery(query);
        if(query === ''){
            setAllFormations(false);
            return;
        }
        const newData = formations.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(newData);
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
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
                {(searchQuery !== '' || allFormations)? (<FlatList
                data={filteredData}
                keyExtractor={(item) => item.id_thematique.toString()}
                renderItem={({ item } : { item: any }) => (
                    <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={item.progression} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}
                
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ fontSize: 18, color: 'gray' }}>Aucune thématique trouvée</Text>
                    </View>
                }

                persistentScrollbar={false}
                bounces={true}
            />) : (
                <>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginHorizontal: 20 }}>Continuer...</Text>
                    <View style={{ flex: 1 }}>
                    <FlatList
                        data={formationsContinuer.filter(item => item.progression < item._count.formations)}
                        keyExtractor={(item) => item.id_thematique.toString()}
                        ListEmptyComponent={
                            <Text style={styles.textAucun}>Vous n'avez commencé aucune formation</Text>
                        }
                        renderItem={({ item } : { item: any }) => (
                            <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={item.progression} />
                        )}
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginHorizontal: 20, marginTop : 20 }}>Découvrir</Text>
                    <View style={{ flex: 1 }}>
                    <FlatList
                        data={formationsNonCommence}
                        keyExtractor={(item) => item.id_thematique.toString()}
                        ListEmptyComponent={
                            <Text style={styles.textAucun}>Vous avez tout découvert, restez en alerte pour les nouvelles formations !</Text>
                        }
                        renderItem={({ item } : { item: any }) => (
                            <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={item.progression} />
                        )}
                        />
                    </View>
                </View>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end', marginVertical: 20, backgroundColor: Colors.grey, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginRight: 20}} 
                    onPress={() => setAllFormations(true)}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Plus de formations</Text>
                </TouchableOpacity>
                </>
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
    textAucun: {
        fontSize: 16,
        color: 'gray',
        margin: 20,
    },  
})

export default Thematiques
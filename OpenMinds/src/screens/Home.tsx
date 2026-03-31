import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteExplorer from '../components/MascotteExplorer'
import Account from '../components/Account'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProgressionTemplate from '../components/ProgressionTemplate'

const Home = ({navigation}:any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [formationsContinuer, setFormationsContinuer] = useState<any[]>([]);

    const chargerThematiques = async () => {
        const user = await AsyncStorage.getItem('userData');
        const userId = user ? JSON.parse(user).id : null;
        const [response, continuationResponse] = await Promise.all([
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}`),
            fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}&statut=continuer`)
        ]);
        const data = await response.json();
        const dataContinuation = await continuationResponse.json();

        setFormations(data);
        setFormationsContinuer(dataContinuation);
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
        <ScrollView persistentScrollbar={false} style={{ flex: 1, backgroundColor: Colors.white }}>
            <View>
                <LinearGradient style={styles.container}
                    colors={[Colors.purple, Colors.light_pink]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 0, y: 1 }}
                    >
                    <View style={[{ marginTop: insets.top, marginBottom : 20 }, styles.header]}>
                        <Text style={styles.title}>Explorer</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Account />
                        </TouchableOpacity>
                    </View>
                    <MascotteExplorer style={styles.mascotte} />
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
                    <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={item.progression}/>
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
            <>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', margin: 20 }}>Ma progression</Text>
                    <FlatList
                        data={formationsContinuer.filter(item => item.progression < item._count.formations)}
                        horizontal={true}
                        keyExtractor={(item) => item.id_thematique.toString()}
                        renderItem={({ item } : { item: any }) => (
                            <ProgressionTemplate title={item.title} total={item._count.formations} idThematique={item.id_thematique} progression={item.progression} color={item.color} colorTitle={item.colorTitle} description={item.description} image={item.image} />
                        )}
                        showsHorizontalScrollIndicator={false}
                        bounces={true}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', margin: 20 }}>Mon Calendrier</Text>
                </View>
            </>
            )}
            
            </View>
        </ScrollView>
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

export default Home
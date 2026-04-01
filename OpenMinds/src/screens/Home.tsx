import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SectionList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteExplorer from '../components/MascotteExplorer'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProgressionTemplate from '../components/ProgressionTemplate'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar';

const Home = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [formationsContinuer, setFormationsContinuer] = useState<any[]>([]);
    const { user } = useAuth();

    const chargerThematiques = async () => {
        const user2 = await AsyncStorage.getItem('userData');
        const userId = user2 ? JSON.parse(user2).id : null;
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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const newData = formations.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(newData);
    }

    const sections = searchQuery !== '' 
        ? [{ title: 'Recherche', data: filteredData, type: 'SEARCH' }]
        : [
            { title: 'Ma progression', data: [formationsContinuer.filter(item => item.progression < item._count.formations)], type: 'PROGRESSION' },
            { title: 'Mon Calendrier', data: [null], type: 'CALENDAR' }
        ];

    return (
        <SectionList
            sections={sections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => item?.id_thematique?.toString() || index.toString()}
            style={{ flex: 1, backgroundColor: Colors.white }}
            
            ListHeaderComponent={
                <LinearGradient style={styles.container}
                    colors={[Colors.purple, Colors.light_pink]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={[{ marginTop: insets.top, marginBottom: 20 }, styles.header]}>
                        <Text style={styles.title}>Explorer</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Avatar uri={user?.pfp} size={60} />
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
            }

            renderSectionHeader={({ section: { title } }) => {
                if (searchQuery !== '') return null;
                return <Text style={{ fontSize: 30, fontWeight: 'bold', margin: 20 }}>{title}</Text>
            }}

            renderItem={({ item, section }) => {
                if (section.type === 'SEARCH') {
                    return (
                        <ThematiqueTemplate 
                            color={item.color} 
                            colorTitle={item.colorTitle} 
                            title={item.title} 
                            duration={item.totalDuration} 
                            total={item._count.formations} 
                            image={item.image} 
                            description={item.description} 
                            id_thematique={item.id_thematique} 
                            progression={item.progression} 
                        />
                    );
                }

                if (section.type === 'PROGRESSION') {
                    return (
                        <FlatList
                            data={item}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(prog) => prog.id_thematique.toString()}
                            renderItem={({ item: prog }) => (
                                <ProgressionTemplate 
                                    title={prog.title} 
                                    total={prog._count.formations} 
                                    idThematique={prog.id_thematique} 
                                    progression={prog.progression} 
                                    color={prog.color} 
                                    colorTitle={prog.colorTitle} 
                                    description={prog.description} 
                                    image={prog.image} 
                                />
                            )}
                            bounces={true}
                        />
                    );
                }

                if (section.type === 'CALENDAR') {
                    return <View style={{ height: 100 }} /> 
                }

                return null;
            }}

            ListEmptyComponent={
                searchQuery !== '' ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ fontSize: 18, color: 'gray' }}>Aucune thématique trouvée</Text>
                    </View>
                ) : null
            }
        />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
})

export default Home
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SectionList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteExplorer from '../components/MascotteExplorer'
import SessionTemplate from '../components/SessionTemplate';
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SessionsTemplateHome from '../components/SessionsTemplateHome'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar';

interface Session {
  id_session: number;
  date_deb: string;
  date_fin: string;
  presentiel: boolean;
  lieu: string;
  nb_participants: number;
  formation: {
    id_formation: number;
    title: string;
    duration: number;
    description: string;
    image: string;
  };
  thematique: {
    title: string;
    color: string;
    colorTitle: string;
  };
}

const HomeFormateur = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filtered, setFiltered] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const chargerSessions = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const idFormateur = user ? JSON.parse(user).id : null;
      const response = await fetch(`${ENDPOINTS.SESSIONS}?idFormateur=${idFormateur}`);
      const data = await response.json();
      setSessions(data);
      setFiltered(data);
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerSessions();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFiltered(sessions);
      return;
    }
    const result = sessions.filter(s =>
      s.formation.title.toLowerCase().includes(query.toLowerCase()) ||
      s.lieu.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const now = new Date().toISOString();

    const sections = searchQuery !== '' 
    ? [{ title: 'Recherche', data: filtered, type: 'SEARCH' }]
    : [
        { 
            title: 'Mes sessions', 
            data: [sessions.filter(s => s.date_deb > now)], 
            type: 'SESSIONS' 
        }
    ];

    return (
        <SectionList
            sections={sections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => item?.id_session?.toString() || index.toString()}
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
                            placeholder="Chercher des sessions"
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

            renderItem={({ item, section } : { item: any, section: any }) => {
                if (section.type === 'SEARCH') {
                    return (
                        <SessionTemplate presentiel={item.presentiel} date_deb={item.date_deb} date_fin={item.date_fin} description={item.formation.description} color={item.thematique.color} colorTitle={item.thematique.colorTitle} title={item.formation.title} duration={item.formation.duration} image={item.formation.image} id_session={item.id_session} />
                    );
                }

                if (section.type === 'SESSIONS') {
                    return (
                        <FlatList
                            data={item}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(prog) => prog.id_session.toString()}
                            renderItem={({ item: prog }) => (
                                <SessionsTemplateHome 
                                    title={prog.thematique.title}
                                    id_session={prog.id_session}
                                    color={prog.thematique.color}
                                    colorTitle={prog.thematique.colorTitle}
                                    image={prog.formation.image}
                                    date_deb={prog.date_deb}
                                    date_fin={prog.date_fin}
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

export default HomeFormateur
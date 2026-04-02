import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MascotteFormat from '../components/MascotteForma';
import { ENDPOINTS } from '../config/api';
import { Colors } from '../constants/Colors';
import Avatar from '../components/Avatar';
import Loupe from '../components/Loupe'
import Rond from '../components/Rond'
import {useAuth} from '../context/AuthContext';
import SessionTemplate from '../components/SessionTemplate';

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatHeure = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export default function SessionsFormateur({ navigation }: any) {
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

  const renderItem = ({ item }: { item: Session }) => (
    <View style={[styles.card, { backgroundColor: item.thematique.color }]}>
      <View style={styles.cardLeft}>
        <Image source={{ uri: item.formation.image }} style={styles.cardImage} />
      </View>

      <View style={styles.cardMiddle}>
        <View style={[styles.badge, { backgroundColor: item.thematique.colorTitle }]}>
          <Text style={styles.badgeText} numberOfLines={1}>{item.formation.title}</Text>
        </View>
        <Text style={styles.descText} numberOfLines={1}>{item.formation.description.replace(/&nbsp;|#|\*/g, '').trim().slice(0, 40)}...</Text>
        <View style={styles.detailContainer}>
                <Text style={{ fontSize: 12, color: 'black'}}>Durée : {item.formation.duration}h</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Text style={{ fontSize: 12, color: 'black'}}>{item.presentiel ? 'Présentiel' : 'À distance'}</Text>
                    <Rond color={item.presentiel ? Colors.green : Colors.red} height={15} width={15} />
                </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.dateText}>{formatDate(item.date_deb)}</Text>
        <Text style={styles.heureText}>{formatHeure(item.date_deb)} - {formatHeure(item.date_fin)}</Text>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('ListeParticipants', { sessionId: item.id_session })}
        >
          <Text style={styles.detailBtnText}>Détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#9b8ae9' }}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <View>
                <LinearGradient style={styles.container}
                    colors={[Colors.purple, Colors.light_pink]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 0, y: 1 }}
                    >
                    <View style={[{ marginTop: insets.top, marginBottom : 20 }, styles.header]}>
                        <Text style={styles.title}>Sessions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Avatar uri={user?.pfp} size={60} />
                        </TouchableOpacity>
                    </View>
                    <MascotteFormat style={styles.mascotte} />
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
            </View>
      <StatusBar barStyle="light-content" backgroundColor="#9b8ae9" />

        <View style={styles.body}>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#846EE1" />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id_session.toString()}
            
              renderItem={({ item } : { item: any }) => (
                    <SessionTemplate presentiel={item.presentiel} date_deb={item.date_deb} date_fin={item.date_fin} description={item.formation.description} color={item.thematique.color} colorTitle={item.thematique.colorTitle} title={item.formation.title} duration={item.formation.duration} image={item.formation.image} id_session={item.id_session} />
                )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Aucune session trouvée</Text>
                </View>
              }
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    marginTop: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  body: { flex: 1, paddingTop: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#aaa', fontStyle: 'italic' },

  card: {
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#846EE1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cardLeft: { marginRight: 10 },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  cardMiddle: { flex: 1, marginRight: 8 },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  descText: { fontSize: 11, color: Colors.grey, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10},
  metaText: { fontSize: 11, color: '#444', fontWeight: '500'},
  presentielRow: { flexDirection: 'row', alignItems: 'center'},

  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 90 },
  dateText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  heureText: { fontSize: 10, color: '#666', marginBottom: 6 },
  detailBtn: {
    backgroundColor: Colors.primary_blue,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
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
    avatarPlaceholder: { 
        width: 60, 
        height: 60, 
        borderRadius: 100, 
        backgroundColor: '#CCC',  
        overflow: 'hidden',
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
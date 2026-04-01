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
import MascotteForma from '../../components/MascotteForma';
import Account from '../../components/Account';
import { ENDPOINTS } from '../../config/api';

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
  const [search, setSearch] = useState('');

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
    setSearch(query);
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
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>Durée : {item.formation.duration}h</Text>
          <View style={styles.presentielRow}>
            <Text style={styles.metaText}>{item.presentiel ? 'Présentiel' : 'Distanciel'}</Text>
            <View style={[styles.dot, { backgroundColor: item.presentiel ? '#EF4444' : '#22C55E' }]} />
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
      <StatusBar barStyle="light-content" backgroundColor="#9b8ae9" />
      <View style={styles.container}>

        <LinearGradient
          colors={['#9b8ae9', '#c4b8f0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Sessions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Account />
            </TouchableOpacity>
          </View>
          <MascotteForma style={{}} />
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Chercher des sessions"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={handleSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#846EE1" />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id_session.toString()}
              renderItem={renderItem}
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
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
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
    borderRadius: 12,
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
  descText: { fontSize: 11, color: '#555', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaText: { fontSize: 11, color: '#444', fontWeight: '500' },
  presentielRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 90 },
  dateText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  heureText: { fontSize: 10, color: '#666', marginBottom: 6 },
  detailBtn: {
    backgroundColor: '#4B3F8A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// L'IMPORT MAGIQUE DE TA VRAIE MASCOTTE !
import MascotteForma from '../../components/MascotteForma';
import { ENDPOINTS } from '../../config/api';

interface Participant {
  id_benevole: number;
  id_session: number;
  nom: string;
  prenom: string;
  statut_presence: boolean;
}

export default function ListeParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ENDPOINTS.PARTICIPANTS}?sessionId=1`;

  useEffect(() => {
    chargerParticipants();
  }, []);

  const chargerParticipants = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenirInitiales = (prenom: string, nom: string) => {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }

  const togglePresence = (id: number) => {
    console.log("Changer la présence pour le bénévole n°", id);
  };

  const renderItem = ({ item }: { item: Participant }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {obtenirInitiales(item.prenom, item.nom)}
            </Text>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.titleBadge}>
              <Text style={styles.nameText}>{item.prenom} {item.nom}</Text>
            </View>
            <Text style={styles.subText}>Inscrit(e) à la session</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, item.statut_presence ? styles.buttonPresent : styles.buttonAbsent]}
          onPress={() => togglePresence(item.id_benevole)}
        >
          <Text style={styles.buttonText}>
            {item.statut_presence ? "Présent" : "Absent"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#A292EA" />
      
      <View style={styles.container}>
        
        {/* Ton magnifique dégradé */}
        <LinearGradient 
          colors={['#9b8ae9', '#d8d7dc']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.headerBackground}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Présences</Text>
            <View style={styles.profileIconPlaceholder} />
          </View>
        
          <View style={styles.mascotInlineContainer}>
             <MascotteForma style={{}} />
          </View>
        </LinearGradient>
       
        {/* La liste des participants */}
        <View style={styles.bodyContent}>
          <Text style={styles.sectionTitle}>Liste des bénévoles...</Text>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4B3F8A" />
            </View>
          ) : (
            <FlatList
              data={participants}
              keyExtractor={(item) => item.id_benevole.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun bénévole inscrit.</Text>
                </View>
              }
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

// L'objet "styles" indispensable pour que les lignes rouges disparaissent !
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#A292EA' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  headerBackground: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    zIndex: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

 mascotInlineContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },

  bodyContent: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },

  cardContainer: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#A292EA',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  card: { 
    backgroundColor: '#F8F6FE',
    padding: 16, 
    borderRadius: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2DDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: { color: '#846EE1', fontWeight: 'bold', fontSize: 18 },
  infoSection: { flex: 1 },
  
  titleBadge: {
    backgroundColor: '#846EE1',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  subText: { fontSize: 12, color: '#A19EAF' },

  actionButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPresent: { backgroundColor: '#4B3F8A' },
  buttonAbsent: { backgroundColor: '#EF4444' },
  buttonText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#A19EAF', fontStyle: 'italic' }
});
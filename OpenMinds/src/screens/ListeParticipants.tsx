import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  StatusBar, TouchableOpacity, SafeAreaView, Image, ScrollView
} from 'react-native';
import { ENDPOINTS } from '../config/api';
import { Colors } from '../constants/Colors';
import Rond from '../components/Rond';

interface Participant {
  id_benevole: number;
  id_session: number;
  nom: string;
  prenom: string;
  statut_presence: boolean;
}

interface SessionInfo {
  date_deb: string;
  date_fin: string;
  presentiel: boolean;
  lieu: string;
  formation: {
    title: string;
    duration: number;
    description: string;
    image: string;
  };
}

const InfoSessionHeader = ({ titre, date, presentiel }: { titre: string, date: string, presentiel: boolean }) => (
  <View style={styles.details}>
    <Text style={styles.cardText}>{titre}</Text>
    <View style={styles.details1}>
        <Text style={styles.dateLabel}>{date}</Text>
        <View style={styles.presentiel}>
            <Rond color={presentiel ? Colors.green : Colors.red} height={15} width={15}/>
            <Text style={styles.presentielText}>{presentiel ? 'Présentiel' : 'Distanciel'}</Text>
        </View>
    </View>
  </View>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDuration = (dateDebStr: string, dateFinStr: string) => {
  const deb = new Date(dateDebStr);
  const fin = new Date(dateFinStr);
  const diff = (fin.getTime() - deb.getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h${m}` : `${h}h`;
};

export default function ListeParticipants({ route, navigation }: any) {
  const { sessionId } = route.params;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [presences, setPresences] = useState<{ [key: number]: boolean }>({});
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    chargerParticipants();
  }, []);

  const chargerParticipants = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.PARTICIPANTS}?sessionId=${sessionId}`);
      const data = await response.json();
      setSession(data.session);
      setParticipants(data.participants);
      const initialPresences: { [key: number]: boolean } = {};
      data.participants.forEach((p: Participant) => {
        initialPresences[p.id_benevole] = p.statut_presence;
      });
      setPresences(initialPresences);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePresence = async (id: number, idSession: number) => {
    const newStatut = !presences[id];
    setPresences(prev => ({ ...prev, [id]: newStatut }));
    await fetch(`${ENDPOINTS.PARTICIPANTS}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idBenevole: id, idSession: idSession, statut: newStatut })
    });
  };

  const obtenirInitiales = (prenom: string, nom: string) => {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  };

  const renderParticipant = (item: Participant) => (
    <View style={styles.card} key={item.id_benevole}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{obtenirInitiales(item.prenom, item.nom)}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.prenom} {item.nom}</Text>
        <Text style={styles.cardSub}>Bénévole</Text>
      </View>
      <View style={styles.buttonsCol}>
        <TouchableOpacity
          style={[styles.presenceBtn, presences[item.id_benevole] ? styles.btnAbsent : styles.btnAbsentActive]}
          onPress={() => togglePresence(item.id_benevole, item.id_session)}
        >
          <Text style={styles.presenceBtnText}>Absent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.presenceBtn, presences[item.id_benevole] ? styles.btnPresentActive : styles.btnPresent]}
          onPress={() => togglePresence(item.id_benevole, item.id_session)}
        >
          <Text style={styles.presenceBtnText}>Présent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary_blue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {session?.formation.image && !imageError ? (
          <Image
            source={{ uri: session.formation.image }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.image, { backgroundColor: '#ddd' }]} />
        )}

        <InfoSessionHeader 
            titre={session?.formation.title || ""} 
            date={session ? formatDate(session.date_deb) : ""} 
            presentiel={session?.presentiel || false} 
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={styles.resumeText}>Présentation de la mission</Text>
          <Text style={styles.resumeText}>
             Durée : {session ? formatDuration(session.date_deb, session.date_fin) : ''}
          </Text>
        </View>

        <Text style={styles.descriptionText}>
          {session?.formation.description.replace(/&nbsp;|#{1,3}|\*/g, '').trim()}
        </Text>

        <View style={styles.separator} />

        <Text style={[styles.resumeText, { marginBottom: 15 }]}>Liste des participants</Text>
        
        <View style={styles.participantsSection}>
          {participants.length === 0 ? (
            <Text style={styles.emptyText}>Aucun bénévole inscrit.</Text>
          ) : (
            participants.map((item) => renderParticipant(item))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 35, backgroundColor: '#fff', flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200, marginBottom: 20, borderRadius: 30 },
  details: { backgroundColor: '#fff', marginBottom: 20, borderRadius: 8, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  cardText: { fontSize: 25, maxWidth: '65%', fontWeight: 'bold', color: '#000' },
  details1: { gap: 10, alignItems: 'flex-end' },
  dateLabel: { fontSize: 14, color: '#333', fontWeight: 'bold' },
  presentiel: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  presentielText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  resumeText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  descriptionText: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 20 },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  participantsSection: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontWeight: 'bold', fontSize: 16, color: '#846EE1' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  voirProfil: { fontSize: 12, color: '#846EE1', textDecorationLine: 'underline', marginTop: 4 },
  buttonsCol: { flexDirection: 'column', gap: 6 },
  presenceBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, alignItems: 'center',
  },
  btnAbsent: { backgroundColor: '#D8D0F8' },
  btnAbsentActive: { backgroundColor: '#EF4444' },
  btnPresent: { backgroundColor: '#D8D0F8' },
  btnPresentActive: { backgroundColor: '#4B3F8A' },
  presenceBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { color: '#A19EAF', fontStyle: 'italic', textAlign: 'center' },
});
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import React from 'react';
import {Colors} from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Rond from '../components/Rond'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatHeure = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

interface SessionProps {
    color : string,
    colorTitle : string,
    image : string,
    title : string, 
    description : string, 
    duration : number,
    presentiel : boolean, 
    date_deb : string, 
    date_fin : string, 
    id_session : number,
}

const SessionTemplate = ({color, colorTitle, image, title, description, duration, presentiel, date_deb, date_fin, id_session} : SessionProps) => {
const navigation = useNavigation<any>();
  return (
    <View style={[styles.card, { backgroundColor: color, marginHorizontal : 20}]}>
      <View style={styles.cardLeft}>
        <Image source={{ uri: image }} style={styles.cardImage} />
      </View>

      <View style={styles.cardMiddle}>
        <View style={[styles.badge, { backgroundColor: colorTitle }]}>
          <Text style={styles.badgeText} numberOfLines={1}>{title}</Text>
        </View>
        <Text style={styles.descText} numberOfLines={1}>{description.replace(/&nbsp;|#|\*/g, '').trim().slice(0, 40)}...</Text>
        <View style={styles.detailContainer}>
                <Text style={{ fontSize: 12, color: 'black'}}>Durée : {duration}h</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Text style={{ fontSize: 12, color: 'black'}}>{presentiel ? 'Présentiel' : 'À distance'}</Text>
                    <Rond color={presentiel ? Colors.green : Colors.red} height={15} width={15} />
                </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.dateText}>{formatDate(date_deb)}</Text>
        <Text style={styles.heureText}>{formatHeure(date_deb)} - {formatHeure(date_fin)}</Text>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('ListeParticipants', { sessionId: id_session })}
        >
          <Text style={styles.detailBtnText}>Détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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

export default SessionTemplate
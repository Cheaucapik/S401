import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { Colors } from '../constants/Colors';
import Rond from '../components/Rond';
import { useNavigation, useRoute } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';

const InfoFormation = ({titre, numero, presentiel, colorTitle, total} :{ titre : string, numero : number, presentiel : boolean, colorTitle : string, total : number }) => (
  <View style={styles.details}>
    <Text style={styles.cardText}>{titre}</Text>
    <View style={styles.details1}>
        <Text style={[styles.numero, { backgroundColor: colorTitle}]}>{numero}/{total}</Text>
        <View style={styles.presentiel}>
            <Rond color={presentiel ? Colors.green : Colors.red}/>
            <Text style={styles.presentielText}>{presentiel ? 'Présentiel' : 'Distanciel'}</Text>
        </View>
    </View>
  </View>
);

interface FormationAdminsProps {
  image: string;
  numero: number;
  title: string;
  duration: string;
  presentiel: boolean;
  colorTitle: string;
  total : number;
  id : number;
}


const FormationsDetails = () => {

  const route = useRoute();
  const { colorTitle, title, duration, numero, presentiel, total, image, id} = (route.params as FormationAdminsProps) || {};

  const [formation, setFormation] = useState<any>(null)
  const [sessions, setSessions] = useState<any>(null)
  const navigation = useNavigation<any>();

  const isFocused = useIsFocused();

  useEffect(() => {
      if (isFocused && id) {
          chargerFormation();
      }
  }, [isFocused, id]);

  const handlePress = () => {
    if(sessions.length > 0) {
      const s = sessions[0];
      const dateLongue = new Date(s.date_deb).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const heure = new Date(s.date_deb).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const heure_fin = new Date(s.date_fin).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const duree = (new Date(s.date_fin).getTime() - new Date(s.date_deb).getTime()) / (1000 * 60 * 60);


      Alert.alert(
      "Déjà inscrit",
      `Vous êtes inscrit pour le ${dateLongue} à ${heure} pour une durée de ${duree} heure(s) en ${s.presentiel ? 'présentiel' : 'distanciel'}.\n\n`
    );
    } else {
    navigation.navigate('ChoixSession', {
        formationId: id,
        formationTitle: title,
        duration: duration,
    });
}
  }

  const chargerFormation = async () => {
    const user = await AsyncStorage.getItem('userData');
    const userId = user ? JSON.parse(user).id : null;
        const [responseForma, responseSession] = await Promise.all([
            fetch(`${ENDPOINTS.FORMATIONS}?idForma=` + id),
            fetch(`${ENDPOINTS.SESSIONS}?idFormation=${id}&idBenevole=${userId}`)
        ]);
        const data = await responseForma.json();
        const dataSession = await responseSession.json();
        setFormation(data[0]);
        setSessions(dataSession);
    };

    useEffect(() => {
            chargerFormation();
        }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{flex : 1}}>
        <Image source={{ uri: image }} style={styles.image} />
        <InfoFormation titre={title} numero={numero} presentiel={presentiel} colorTitle={colorTitle} total={total} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={styles.resumeText}>Présentation de la formation</Text>
          <Text style={styles.resumeText}>Durée : {duration}h</Text>
        </View>
        {formation ? (
        <Markdown style={markdownStyles}>
          {formation.description}
        </Markdown> ) : (<ActivityIndicator size="large"/>)}
      </View>
      <TouchableOpacity style={{ marginTop: 20, borderRadius: 30, alignItems: 'center'}} 
      onPress={handlePress}>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', backgroundColor: Colors.primary_blue, paddingVertical: 10, borderRadius: 30, paddingHorizontal: 40 }}>Rejoindre</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 35, backgroundColor: Colors.white, flexGrow: 1},
  image:{ width: '100%', height: 200, marginBottom: 20, borderRadius: 30 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: Colors.primary_blue },
  details: {backgroundColor: Colors.white, marginBottom: 20, borderRadius: 8, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  cardText: { fontSize: 25, maxWidth: '70%', fontWeight: 'bold'},
  details1: {gap: 10},
  numero : { alignSelf : 'flex-end', fontSize: 14, marginTop: 5, color: Colors.white, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20, fontWeight: 'bold'},
  presentiel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  presentielText: { fontSize: 16, fontWeight: 'bold', marginLeft:10},
  resumeText : { fontSize: 16, fontWeight: 'bold'},
});

const markdownStyles = {
  body : { fontSize: 14},
}

export default FormationsDetails;
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import PetitRondRouge from '../components/Rond';

const InfoFormation = ({titre, numero} :{ titre : string, numero : number }) => (
  <View style={styles.details}>
    <Text style={styles.cardText}>{titre}</Text>
    <View style={styles.details1}>
        <Text style={styles.numero}>{numero}/5</Text>
        <View style={styles.presentiel}>
            <PetitRondRouge color={Colors.red}/>
            <Text style={styles.presentielText}>Présentiel</Text>
        </View>
    </View>
  </View>
);


const FormationsDetails = () => {
  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/AidePersonnes.png')} style={styles.image} />
      <InfoFormation titre="Aide aux personnes isolées" numero={1} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.white },
  image:{ width: '100%', height: 200, marginBottom: 20, borderRadius: 30 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: Colors.primary_blue },
  details: {padding: 15, backgroundColor: Colors.white, marginBottom: 10, borderRadius: 8, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  cardText: { fontSize: 25, maxWidth: '70%', fontWeight: 'bold'},
  details1: {gap: 10},
  numero : { alignSelf : 'flex-end', fontSize: 14, backgroundColor: Colors.axe_color_blue, marginTop: 5, color: Colors.white, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20, fontWeight: 'bold'},
  presentiel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  presentielText: { fontSize: 14, fontWeight: 'bold', marginLeft:10},
});

export default FormationsDetails;
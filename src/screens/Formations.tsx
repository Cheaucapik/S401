import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/Colors';

// 1. Petite fonction pour un élément de liste
const InfoFormation = ({titre, numero} :{ titre : string, numero : number }) => (
  <View style={styles.details}>
    <Text style={styles.cardText}>{titre}</Text>
    <Text style={styles.numero}>{numero}/5</Text>
  </View>
);


const Formations = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Formations</Text>
      <Image source={require('../assets/AidePersonnes.png')} style={styles.image} />
      <InfoFormation titre="Aide aux personnes isolées" numero={1} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.white },
  image:{ width: '100%', height: 200, marginBottom: 20, borderRadius: 30 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: Colors.primary_blue },
  details: { padding: 15, backgroundColor: Colors.white, marginBottom: 10, borderRadius: 8 },
  cardText: { fontSize: 18 },
  numero : { fontSize: 14, backgroundColor: Colors.axe_color_blue, marginTop: 5 },
});

export default Formations;
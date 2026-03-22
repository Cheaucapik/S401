import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const PetitRondRouge = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rondRouge} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  rondRouge: {
    width: 20,
    height: 20,
    backgroundColor: Colors.red,
    borderRadius: 15,
  },
});

export default PetitRondRouge;
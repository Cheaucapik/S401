import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const PetitRond = ({color, height = 20, width = 20} : { color: string, height?: number, width?: number }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.rondRouge, {backgroundColor: color, height: height, width: width }]} />
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
    borderRadius: 15,
  },
});

export default PetitRond;
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';

const PastilleActive = ({ children, focused }: { children: React.ReactNode, focused: boolean }) => {
  return (
    <View style={[
        styles.pastille, 
        { backgroundColor: focused ? Colors.light_blue : 'transparent',
          marginBottom: focused ? 60 : 0,
          borderWidth: focused ? 2 : 0,
          elevation: focused ? 2 : 0,
        }
    ]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  pastille: {
    borderRadius: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export default PastilleActive
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Settings = ({ navigation }:any) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient style={styles.container}
                colors={[Colors.purple, Colors.light_pink]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 0, y: 1 }}
                >

      <View style={[{marginTop:insets.top}, styles.header]}>
        <View style={styles.sideContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.title}>Profile</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, 
        maxHeight: 225,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    title: { fontSize: 30, fontWeight: 'bold', color: Colors.white, marginLeft: 20, alignItems: 'center'},
    header : {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    arrowLeft: {
      alignItems: 'center',
      },
    sideContainer: {
      flex: 1,
      alignItems: 'flex-start',
  },
    centerContainer: {
      flex: 5
    },
  })

export default Settings
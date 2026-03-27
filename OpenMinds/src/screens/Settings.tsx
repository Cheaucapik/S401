import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useAuth} from '../context/AuthContext'

const Settings = ({ navigation }:any) => {
  const insets = useSafeAreaInsets();

  const {setUserToken} = useAuth();

  const logout = async () => {
    try{
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      setUserToken(null);

      console.log("Déconnexion réussie");
    }
    catch(error){
      console.error("Erreur : "+ error)
    }
  }

  return (
    <>
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
    <TouchableOpacity activeOpacity={1} onPress={() => logout()}>
      <Text>Se déconnecter</Text>
    </TouchableOpacity>
    </>
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
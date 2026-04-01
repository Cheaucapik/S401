import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useAuth} from '../context/AuthContext'
import Logout from '../components/Logout'

const Settings = ({ navigation }:any) => {
  const insets = useSafeAreaInsets();

  const { logout } = useAuth();

const handleLogout = async () => {
    await logout();
    console.log("Déconnexion réussie");
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          console.log("Données de l'utilisateur :", user);
          return user;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'utilisateur :", error);
      }
    };
    loadUserData();
    }, []);

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

      <View style={{alignSelf : 'center', marginTop : 10, padding : 60, borderRadius : 100, backgroundColor : Colors.grey}} >
        <Image/>
      </View>
      <Text style={{color : Colors.white, fontSize : 25, textAlign: 'center', fontWeight: 'bold', marginTop: 10}}>Nom Prénom</Text>
      <Text style={{color : Colors.grey, fontSize : 16, textAlign: 'center'}}>nom.prenom@mail.com</Text>
    </LinearGradient>

    <View style={{flex: 1, backgroundColor: Colors.white, padding: 20, justifyContent: 'flex-end'}}>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom : 40}} activeOpacity={1} onPress={() => handleLogout()}>
        <Logout/>
        <Text style={{color: Colors.primary_blue, fontSize: 16, fontWeight: 'bold', marginLeft: 10}}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        paddingBottom: 20,
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
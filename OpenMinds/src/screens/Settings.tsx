import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react' 
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../context/AuthContext'
import Logout from '../components/Logout'
import Pencil from '../components/Pencil'
import KeyIcon from '../components/KeyIcon'

const Settings = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { setUserToken } = useAuth();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setUserToken(null);
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setPrenom(user.prenom || '');
          setNom(user.nom || '');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error("Erreur chargement settings :", error);
      }
    };
    loadUserData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      {}
      <LinearGradient
        style={styles.container}
        colors={[Colors.purple, Colors.light_pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={[{ marginTop: insets.top }, styles.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.headerTitle}>{prenom} {nom}</Text>
        <Text style={styles.headerSubtitle}>{email}</Text>
      </LinearGradient>

      {}
      <View style={{ flex: 1, padding: 40, justifyContent: 'flex-start' }}>
        
        <TouchableOpacity 
          style={styles.optionRow} 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={styles.iconCircle}>
            <Pencil />
          </View>
          <Text style={styles.optionText}>Modifier profil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionRow} 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View style={styles.iconCircle}>
            <KeyIcon />
          </View>
          <Text style={styles.optionText}>Changer de mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionRow} 
          activeOpacity={0.8} 
          onPress={logout}
        >
          <View style={styles.iconCircle}>
            <Logout />
          </View>
          <Text style={styles.optionText}>Se déconnecter</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    borderBottomRightRadius: 30, 
    borderBottomLeftRadius: 30, 
    paddingBottom: 30, 
    alignItems: 'center' 
  },
  header: { width: '100%', paddingHorizontal: 20 },
  avatarPlaceholder: { 
    marginTop: 10, 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#CCC', 
    opacity: 0.5 
  },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  headerSubtitle: { color: '#FFF', fontSize: 14, opacity: 0.8 },
  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: Colors.light_blue, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  optionText: { 
    color: Colors.primary_blue, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 15 
  },
})

export default Settings;
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '../constants/Colors'
import LinearGradient from 'react-native-linear-gradient'
import ArrowLeft from '../components/ArrowLeft'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'
import Logout from '../components/Logout'
import Pencil from '../components/Pencil'
import KeyIcon from '../components/KeyIcon'
import Avatar from '../components/Avatar';

const Settings = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const { logout, user} = useAuth();

const handleLogout = async () => {
    await logout();
    console.log("Déconnexion réussie");
  };

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
        <View style={styles.avatarPlaceholder}>
          <Avatar uri={user?.pfp} size={120} />
        </View>
        <Text style={styles.headerTitle}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.headerSubtitle}>{user?.email}</Text>
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
          onPress={handleLogout}
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
    width: 120, 
    height: 120, 
    borderRadius: 100, 
    backgroundColor: '#CCC',  
    overflow: 'hidden',
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
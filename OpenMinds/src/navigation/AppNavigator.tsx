import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import FormationsDetails from '../screens/FormationsDetails';
import Settings from '../screens/Settings';
import Formations from '../screens/Formations'
import { ActivityIndicator } from 'react-native';
import Login from '../screens/Login'
import { useAuth } from '../context/AuthContext';
import Signup from '../screens/Signup';
import RootNavigatorAdmin from './RootNavigatorAdmin';
import RootNavigatorFormateur from './RootNavigatorFormateur';
import {Colors} from '../constants/Colors';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import ListeParticipants from '../screens/ListeParticipants';
import FormationsAxe from '../screens/FormationsAxe';
import FormationAdmin from '../screens/FormationAdmin';
import ChoixSession from '../screens/ChoixSession';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, user, isLoading } = useAuth();
  console.log('[AppNavigator] role:', user?.role, 'token:', !!token)

if (isLoading || (token && !user?.role)) return <ActivityIndicator size="large" style={{flex:1}} />;
  if (!token) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (user?.role === "ADMINISTRATEUR") {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminRoot" component={RootNavigatorAdmin} />
          <Stack.Screen name="FormationsAxe" component={FormationsAxe} />
          <Stack.Screen name="FormationAdmin" component={FormationAdmin} />
          <Stack.Screen name="Profile" component={Settings}/>
          <Stack.Screen name="EditProfile" component={EditProfile}/>
          <Stack.Screen name="ChangePassword" component={ChangePassword}/>
          <Stack.Screen name="ChoixSession" component={ChoixSession} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  else if (user?.role === "FORMATEUR") {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="FormateurRoot" component={RootNavigatorFormateur} />
          <Stack.Screen name="ListeParticipants" component={ListeParticipants}
        options={{
            headerTitle: "Session",
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold'},
            headerTintColor: Colors.primary_blue,
            headerShadowVisible: false,}} />
          <Stack.Screen name="Profile" component={Settings}/>
          <Stack.Screen name="EditProfile" component={EditProfile}/>
          <Stack.Screen name="ChangePassword" component={ChangePassword}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BenevoleRoot" component={RootNavigator} />
        <Stack.Screen name="ChoixSession" component={ChoixSession} />
        <Stack.Screen name="FormationsDetails" component={FormationsDetails}
        options={{
            headerTitle: "Formations",
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold'},
            headerTintColor: Colors.primary_blue,
            headerShadowVisible: false,}} />
        <Stack.Screen name="Formations" component={Formations}
        options={{
            headerTitle: "Formations",
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold'},
            headerTintColor: Colors.primary_blue,
            headerShadowVisible: false,}} />
        <Stack.Screen name="Profile" component={Settings}/>
        <Stack.Screen name="EditProfile" component={EditProfile}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator
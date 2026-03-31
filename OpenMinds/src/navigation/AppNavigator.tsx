import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import FormationsDetails from '../screens/FormationsDetails';
import Settings from '../screens/Settings';
import Formations from '../screens/Formations'
import { Colors } from '../constants/Colors';
import { ActivityIndicator } from 'react-native';
import Login from '../screens/Login'
import { useAuth } from '../context/AuthContext';
import Signup from '../screens/Signup';
import RootNavigatorAdmin from './RootNavigatorAdmin'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, isLoading, userType } = useAuth();

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        {userToken === null ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        ) : userType === "ADMINISTRATEUR" ? (
          <Stack.Screen name="AdminRoot" component={RootNavigatorAdmin} />
        ) : (
          <>
            <Stack.Screen name="BenevoleRoot" component={RootNavigator} />
            <Stack.Screen 
              name="Formations" 
              component={Formations} 
              options={{
                headerShown: true,
                headerTitle: "Axes",
                headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
                headerTintColor: Colors.primary_blue,
                headerShadowVisible: false,
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen 
              name="FormationsDetails" 
              component={FormationsDetails}
              options={{
                headerTitle: "Formations",
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
                headerTintColor: Colors.primary_blue,
                headerShadowVisible: false,
              }} 
            />
            <Stack.Screen name="Profile" component={Settings} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import FormationsDetails from '../screens/FormationsDetails';
import Settings from '../screens/Settings';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={RootNavigator} />
        <Stack.Screen name="Formations" component={FormationsDetails}
        options={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 24, fontWeight: 'bold'},
            headerTintColor: Colors.primary_blue,
            headerShadowVisible: false,}} />
        <Stack.Screen name="Profile" component={Settings}/>
      </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Settings from '../screens/Settings'; 
import {Colors} from '../constants/Colors';
import HomeIcon from '../components/HomeIcon';
import FormationIcon from '../components/FormationIcon';
import UserProfiles from '../components/UserProfiles'
import SettingsIcon from '../components/SettingsIcon';
import { Pressable, StyleSheet, Text } from 'react-native';
import PastilleActive from '../components/PastilleActive';
import Thematiques from '../screens/Thematiques';
import HomePageAdmin from '../screens/HomePageAdmin'
import AxesAdmin from '../screens/AxesAdmin'


const Tab = createBottomTabNavigator();


const RootNavigatorAdmin = () => {

  return (
    <Tab.Navigator
      initialRouteName='HomePageAdmin'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.purple,
        tabBarInactiveTintColor: Colors.primary_blue,
        tabBarStyle: { 
            height: 80, 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20,
            backgroundColor: Colors.light_blue,
         }
      }}
    >
      <Tab.Screen name="AxesAdmin" 
      component={AxesAdmin}
      options={{
        tabBarButton: (props) => {
          const { ref, ...rest } = props;
          return (
            <Pressable
              {...rest}
              android_ripple={{ color: 'transparent' }}
            />
          );
        },
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Axes" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
           <FormationIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
        </PastilleActive>
        )
      }}
      />
      <Tab.Screen name="HomePageAdmin" 
      component={HomePageAdmin}
      options={{
        tabBarButton: (props) => {
          const { ref, ...rest } = props;
          return (
            <Pressable
              {...rest}
              android_ripple={{ color: 'transparent' }}
            />
          );
        },
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Admin" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
          <HomeIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
        </PastilleActive>
        )
      }}
      />


      <Tab.Screen name="Formateurs" component={Home}
      options={{
        tabBarButton: (props) => {
          const { ref, ...rest } = props;
          return (
            <Pressable
              {...rest}
              android_ripple={{ color: 'transparent' }}
            />
          );
        },
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Formateurs" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
          <UserProfiles color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
        </PastilleActive>)
      }} />


      <Tab.Screen name="Settings" component={Settings}
      options={{
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Settings" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
          <SettingsIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
        </PastilleActive>
        ),
        tabBarButton: (props) => {
          const { ref, ...rest } = props;
          return (
            <Pressable
              {...rest}
              android_ripple={{ color: 'transparent' }}
            />
          );
        }
      }} 
      
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: Colors.primary_blue,
  },
});

export default RootNavigatorAdmin;
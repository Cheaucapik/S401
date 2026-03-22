import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Formations from '../screens/Formations';
import Home from '../screens/Home';
import Settings from '../screens/Settings'; 
import {Colors} from '../constants/Colors';
import HomeIcon from '../components/HomeIcon';
import FormationIcon from '../components/FormationIcon';
import SettingsIcon from '../components/SettingsIcon';
import { Pressable, StyleSheet, Text } from 'react-native';
import PastilleActive from '../components/PastilleActive';

const Tab = createBottomTabNavigator();


const RootNavigator = () => {

  return (
    <Tab.Navigator
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
      <Tab.Screen name="FormationsListe" 
      component={Formations}
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
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Formations" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
           <FormationIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
        </PastilleActive>
        )
      }}
      />


      <Tab.Screen name="Home" component={Home}
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
        tabBarLabel: ({focused}) => <Text style={styles.text}>{focused ? "Home" : ""}</Text>,
        tabBarIcon: ({focused}) => (
        <PastilleActive focused={focused}>
          <HomeIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
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

export default RootNavigator;
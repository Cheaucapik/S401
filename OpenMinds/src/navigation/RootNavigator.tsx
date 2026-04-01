import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import { Colors } from '../constants/Colors';
import HomeIcon from '../components/HomeIcon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PastilleActive from '../components/PastilleActive';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
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
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarButton: (props) => {
            const { ref, ...rest } = props;
            return <Pressable {...rest} android_ripple={{ color: 'transparent' }} />;
          },
          tabBarLabel: ({ focused }) => <Text style={styles.text}>{focused ? "Accueil" : ""}</Text>,
          tabBarIcon: ({ focused }) => (
            <PastilleActive focused={focused}>
              <HomeIcon color={focused ? Colors.purple : Colors.primary_blue} size={focused ? 40 : 30} />
            </PastilleActive>
          )
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
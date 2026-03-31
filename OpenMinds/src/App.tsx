import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { useEffect } from 'react'
import BootSplash from "react-native-bootsplash";
import { AuthProvider } from './context/AuthContext';
import ListeParticipants from'./screens/Formateur/ListeParticipants';

const App = () => {
  useEffect(() => {
  const init = async () => {
    await BootSplash.hide({ fade: true }); 
  };

  init();
}, []);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <AuthProvider>
        {/* On met la navigation de l'équipe en pause temporairement */}
        {/* <AppNavigator /> */}
        
        {/* On met ton tout nouvel écran sous les projecteurs ! */}
        <ListeParticipants />
      </AuthProvider>
    </>
  );
};

export default App;
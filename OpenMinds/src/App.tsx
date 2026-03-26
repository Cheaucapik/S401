import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { useEffect } from 'react'
import BootSplash from "react-native-bootsplash";

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
    <AppNavigator />
  </>
  );
};

export default App;
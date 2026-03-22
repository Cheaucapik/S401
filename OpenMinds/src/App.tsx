import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';

const App = () => {
  return (
  <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" />
    <AppNavigator />
  </>
  );
};

export default App;
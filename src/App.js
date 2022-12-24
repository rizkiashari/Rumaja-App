import React from 'react';
import FlashMessage from 'react-native-flash-message';
import 'moment/locale/id';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import Router from './router';

const App = () => {
  return (
    <>
      <NavigationContainer>
        <NativeBaseProvider>
          <Router />
        </NativeBaseProvider>
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
};

export default App;

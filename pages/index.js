import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAuth} from 'components/context/Auth';
import LeftDrawer from 'components/layout/LeftDrawer';
import RightDrawer from 'components/layout/RightDrawer';
import Login from './burtgel/Login';

export default function Screen() {
  const {token, ajiltan} = useAuth();
  if (!!ajiltan && !!token)
    return (
      <SafeAreaProvider>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle="dark-content"
          showHideTransition="fade"
        />
        <NavigationContainer>
          <RightDrawer component={LeftDrawer} />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  return (
    <SafeAreaProvider>
      <Login />
    </SafeAreaProvider>
  );
}

import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {store} from '@store/index';
import {useAppDispatch, useAppSelector} from '@store/index';
import {setToken} from '@store/slices/auth';

import {Provider} from 'react-redux';
import {toastConfig} from './configs/toastConfig';

import Home from '@screens/Home';
import NewSale from '@screens/NewSale';
import Orders from '@screens/Orders';
import Notification from '@screens/Notification';
import Settings from '@screens/Settings';
import Login from '@screens/auth/Login';

const MainTab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast config={toastConfig} topOffset={10} visibilityTime={2000} />
    </Provider>
  );
}

function AppNavigator(): React.JSX.Element {
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const tokenStorage = await AsyncStorage.getItem('token');
      if (tokenStorage) {
        dispatch(setToken(tokenStorage));
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      {token ? (
        <MainNavigator />
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={Login} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

function MainNavigator(): React.JSX.Element {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={Home} />
      <MainTab.Screen name="NewSale" component={NewSale} />
      <MainTab.Screen name="Orders" component={Orders} />
      <MainTab.Screen name="Notification" component={Notification} />
      <MainTab.Screen name="Settings" component={Settings} />
    </MainTab.Navigator>
  );
}

export default App;

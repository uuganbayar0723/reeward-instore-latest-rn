import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {store} from './store';
import {Provider, useDispatch} from 'react-redux';
import {useAppDispatch, useAppSelector} from './store';
import {useLoginMutation} from './store/services/api';
import {setToken} from './store/slices/auth';

const AppStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppNavigator />
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
        <AppStack.Navigator>
          <AppStack.Screen name="Home" component={HomeScreen} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation();

  const count = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  return (
    <View className="bg-red-100">
      <Text>Home Screen</Text>
      <Button title="Countup" />
      <Button title="Login" />
    </View>
  );
}

function LoginScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const [login, response] = useLoginMutation();

  function handleLogin() {
    login({email, password});
  }

  useEffect(() => {
    if (response.isSuccess) {
      const {data} = response.data;
      const {token} = data;
      AsyncStorage.setItem('token', token);
      dispatch(setToken(token));
    }
  }, [response]);

  return (
    <KeyboardAvoidingView className="flex-1 bg-white h-44">
      <View className="px-10 items-center pt-20">
        <Text>Login</Text>
        <View className="mt-14 space-y-5 w-[200px]">
          <TextInput
            className="w-full  border rounded-md"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            className="w-full  border rounded-md"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={handleLogin}
            className="rounded-md py-3 w-full justify-center items-center bg-black">
            <Text className="text-white">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default App;

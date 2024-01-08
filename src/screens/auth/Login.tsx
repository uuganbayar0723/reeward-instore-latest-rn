import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {useDispatch} from 'react-redux';
import {useLoginMutation} from '@store/services/api';
import {setToken} from '@store/slices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

function Login(): React.JSX.Element {
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

      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: `Hello ${data.user.name}`,
      });
    }
    if (response.isError) {
      Toast.show({
        type: 'error',
        text1: 'Login error',
        text2: `error`,
      });
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

export default Login;
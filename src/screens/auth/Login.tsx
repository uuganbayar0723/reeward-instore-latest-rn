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
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AppButton from '@components/AppButton';
import {setUser} from '@store/slices/user';
import {storeSetItem, storeSetObj, StorageKeys} from '@utils/asyncStorage';

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
      const {token, user} = data;
      const {email, firstname, lastname, name, role, language, outlet} = user;
      const {_id: outletId} = outlet;
      const userFormatted = {
        outletId,
        // email,
        // firstname,
        // lastname,
        // name,
        // role,
        // language,
        // merchant: {
        //   id: merchantId,
        //   name: merchantName,
        // },
      };

      storeSetItem({key: StorageKeys.TOKEN, value: token});
      storeSetObj({key: StorageKeys.USER, value: userFormatted});
      dispatch(setToken(token));
      dispatch(setUser(userFormatted));

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
          <AppButton text="Login" onPress={handleLogin} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login;

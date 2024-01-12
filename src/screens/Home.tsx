import React, {useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store';
import {setToken} from '../store/slices/auth';
import { StorageKeys, storeRemoveItem } from '@utils/asyncStorage';
import AppButton from '@components/AppButton';

function Home(): React.JSX.Element {

  const count = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  function logout() {
    dispatch(setToken(''));
    storeRemoveItem(StorageKeys.Token);
  }

  return (
    <View className="flex-1 justify-center items-center">
      <AppButton text="Logout" onPress={logout} />
    </View>
  );
}

export default Home;

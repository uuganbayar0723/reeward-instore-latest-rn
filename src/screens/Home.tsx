import React, {useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store';
import {setAuth} from '../store/slices/auth';
import {StorageKeys, storeRemoveItem} from '@utils/asyncStorage';
import AppButton from '@components/AppButton';

function Home(): React.JSX.Element {
  const dispatch = useAppDispatch();

  function logout() {
    dispatch(setAuth(null));
    storeRemoveItem(StorageKeys.AUTH);
    storeRemoveItem(StorageKeys.BASKET_LIST);
  }

  return (
    <View className="flex-1 justify-center items-center">
      <AppButton text="Logout" onPress={logout} />
    </View>
  );
}

export default Home;

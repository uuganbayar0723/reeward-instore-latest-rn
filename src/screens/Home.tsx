import React, {useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store';
import {setToken} from '../store/slices/auth';

function Home(): React.JSX.Element {

  const count = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  function logout() {
    dispatch(setToken(''));
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Home Screen</Text>
      <Button title="Logout Temp" onPress={logout} />
    </View>
  );
}

export default Home;

import React, {useEffect} from 'react';
import {View, Button, Text} from 'react-native';
import AppButton from '@components/AppButton';
import {useAppSelector} from '@store/index';
import { StorageKeys, storeGetObj } from '@utils/asyncStorage';

function NewSale(): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);

  useEffect(() => {
    (async () => {
      console.log({user})
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>New Sale</Text>
      <AppButton
        text="Button"
        onPress={() => {
          console.log('hello');
        }}
      />
    </View>
  );
}

export default NewSale;

import React from 'react';
import {View, Button, Text} from 'react-native';
import AppButton from '@components/AppButton';

function NewSale(): React.JSX.Element {
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

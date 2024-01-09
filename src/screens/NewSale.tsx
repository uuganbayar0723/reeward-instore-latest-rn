import React, {useEffect} from 'react';
import {View, Button, Text} from 'react-native';
import AppButton from '@components/AppButton';
import {useAppSelector} from '@store/index';
import {useGetMenuQuery} from '@store/services/api';

function NewSale(): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  console.log({user: user?.outletId});
  let {data, isLoading, isFetching, error} = useGetMenuQuery({
    outletId: user?.outletId,
    filter: {},
    sort: 'createdAt:DESC',
    offset: 1,
    limit: 25,
  });
  console.log(error);
  console.log(data);

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

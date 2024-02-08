import {useGetMeQuery, useGetOrdersQuery} from '@store/services/api';
import React from 'react';
import {View, Button, Text} from 'react-native';

function Orders(): React.JSX.Element {
  let {data, isLoading, isSuccess} = useGetOrdersQuery(null);

  console.log(data);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Orders</Text>
    </View>
  );
}

export default Orders;

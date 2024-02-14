import AppText from '@components/AppText';
import colors from '@constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGetOrdersQuery} from '@store/services/api';
import {StorageKeys, storeGetMultiple} from '@utils/asyncStorage';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, Button, Text, FlatList, TouchableOpacity} from 'react-native';

function Orders(): React.JSX.Element {
  // let {data, isLoading, isSuccess} = useGetOrdersQuery(null);
  // console.log(data);
  const [orderList, setOrderList] = useState<any>([]);

  useEffect(() => {
    if (orderList.length === 0) {
      getStorageOrders();
    }
  }, []);

  async function getStorageOrders() {
    const allKeys = await AsyncStorage.getAllKeys();
    // const dateNow = moment().format("YYYY-MM-DD");
    const orderKeys = allKeys
      .filter(key => key.includes(`${StorageKeys.ORDER}-`))
      .map(key => parseInt(key.split(`${StorageKeys.ORDER}-`)[1]))
      .sort((a, b) => a - b);

    const orderOffset = 20;
    const lastOrderIds = orderKeys.slice(orderKeys.length - orderOffset);
    const lastOrderKeys = lastOrderIds.map(id => `${StorageKeys.ORDER}-${id}`);

    const lastOrders = (await storeGetMultiple(lastOrderKeys))?.reverse();

    setOrderList(lastOrders);
  }

  console.log(orderList);

  return (
    <View className="flex-1 ">
      <FlatList
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        data={orderList}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        className="px-screenPadding pt-screenTop"
        ListFooterComponent={() => <View className="h-8"></View>}
        renderItem={({item: order}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            className="p-3 bg-white shadow-md rounded-lg">
            <View className="flex-row justify-between">
              <View className="">
                <View className="flex-row items-center">
                  <AppText className="font-medium text-lg">Order</AppText>
                  <AppText className="ml-2">{order.id} (local)</AppText>
                </View>
                <AppText className="font-medium">
                  {moment(order.created_at).format('YYYY.MM.DD HH:mm')}
                </AppText>
              </View>
              <View className="justify-end flex-row">
                <AppText className="font-medium text-lg">
                  ${order.payAmount}
                </AppText>
                <AppText className="font-medium text-green-400 text-lg">
                  /${order.payments ? sumPayments(order.payments) : 0}
                </AppText>
                {/* <AppText className="ml-2">{order}</AppText> */}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function sumPayments(payments: any) {
  return payments.reduce(
    (result: number, current: any) => current.amount + result,
    0,
  );
}

export default Orders;

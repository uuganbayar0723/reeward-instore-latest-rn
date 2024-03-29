import AppText from '@components/AppText';
import colors from '@constants/colors';
import {useMainNavigation} from '@navigators/MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useGetOrdersQuery} from '@store/services/api';
import {StorageKeys, storeGetMultiple} from '@utils/asyncStorage';
import {calSumPayments} from '@utils/helpers';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, Button, Text, FlatList, TouchableOpacity} from 'react-native';

function Orders(): React.JSX.Element {
  // let {data, isLoading, isSuccess} = useGetOrdersQuery(null);
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

  const isFocused = useIsFocused();

  useEffect(() => {
    getStorageOrders()
  }, [isFocused]);

  const navigation = useMainNavigation();

  if (orderList.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText className="text-xl font-bold">No local orders</AppText>
      </View>
    );
  }

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
            onPress={() =>
              navigation.navigate('OrderDetail', {orderId: order.id})
            }
            className="p-3 bg-white shadow-md rounded-lg">
            <View className="flex-row justify-between items-center">
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
                  /${order.payments ? calSumPayments(order.payments) : 0}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Orders;

import AppText from '@components/AppText';
import {RootStackScreenProps} from '@navigators/MainNavigator';
import {StorageKeys, storeGetObj} from '@utils/asyncStorage';
import {formatToBasket} from '@utils/helpers';
import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';

function OrderDetail({
  route,
}: RootStackScreenProps<'OrderDetail'>): React.JSX.Element {
  const {orderId} = route.params;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    getOrder();
  }, []);

  async function getOrder() {
    const orderStorage = await storeGetObj(StorageKeys.ORDER, orderId);
    setOrder(orderStorage);
  }

  if (order === null) {
    return <View></View>;
  }


  return (
    <View className="flex-1 pt-screenTop px-screenPadding">
      <View className="bg-white rounded-lg p-3 shadow-md">
        <AppText className="font-medium text-lg">Order detail</AppText>
        <View className="flex-row justify-between">
          <AppText className="text-base ">Order</AppText>
          <AppText className="text-base font-medium">{orderId}</AppText>
        </View>
        <View className="flex-row justify-between">
          <AppText className="text-base ">Created date</AppText>
          <AppText className="text-base font-medium">
            {moment(order.created_at).format('YYYY.MM.DD HH:mm')}
          </AppText>
        </View>
        <BasketList basketList={order.basketList} />
      </View>
    </View>
  );
}

function BasketList({basketList}: any) {
  return (
    <View className='mt-2'>
      <FlatList
        data={basketList}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index) => `${item.id}${index}`}
        renderItem={({item: product, index}) => (
          <BasketItem key={index} product={product} />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-bgGray my-2"></View>
        )}
      />
    </View>
  );
}

const BasketItem = memo(
  ({product}: any) => {
    let subList = formatToBasket(product);

    return (
      <View className="flex mt-4">
        {/* <BasketItemDetail key={index} /> */}
        <View className="flex-row items-center">
          <FastImage
            style={{borderWidth: 2, borderColor: 'white'}}
            className="w-12 h-12 bg-gray-100 shadow-md  rounded-full"
            source={{uri: product.image_url}}
          />
          <View className="ml-2">
            <AppText className="font-bold ">{product.name}</AppText>
            <AppText className="font-bold">$ {product.price.dine_in}</AppText>
          </View>
        </View>
        <FlatList
          className="mt-4"
          data={subList}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          ItemSeparatorComponent={() => <View className="h-2"></View>}
          renderItem={({item}) => (
            <>
              <BasketItemDetail item={item} />
              {item.subItems.length ? (
                <View className="pl-6">
                  {item.subItems.map((subItem: any, index: number) => (
                    <BasketItemDetail key={index} item={subItem} />
                  ))}
                </View>
              ) : (
                <></>
              )}
            </>
          )}
        />
      </View>
    );
  },
  (prev, last) => prev.product.quantity === last.product.quantity,
);

function BasketItemDetail({item}: any) {
  return (
    <View className="flex-row justify-between ">
      <View className="flex-row">
        <AppText className="w-4">{item.quantity}</AppText>
        <AppText className={`${item.isBold && 'font-medium'}`}>
          {item.name}
        </AppText>
      </View>
      <AppText>$ {item.price}</AppText>
    </View>
  );
}

export default OrderDetail;

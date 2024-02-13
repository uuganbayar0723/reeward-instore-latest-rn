import AppText from '@components/AppText';
import {useAppDispatch, useAppSelector} from '@store/index';
import {
  calcBasketTotalPriceSum,
  calcProductTotalPrice,
  formatToBasket,
  getBundleItemsWithQuantity,
} from '@utils/helpers';
import {FlatList, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '@constants/colors';
import CloseIcon from '@assets/icons/close.png';
import {changeBasketItemQuantity, removeFromBasket} from '@store/slices/basket';
import {memo} from 'react';
import AppButton from '@components/AppButton';
import {useMainNavigation} from '@navigators/MainNavigator';

export default function Basket() {
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;

  if (basketList.length === 0) {
    return (
      <View className="bg-white  flex-1 items-center justify-center">
        <AppText className="font-bold text-xl">Empty</AppText>
      </View>
    );
  }

  return (
    <View className="bg-white  flex-1">
      <FlatList
        className="px-screenPadding"
        data={basketList}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index) => `${item.id}${index}`}
        renderItem={({item: product, index}) => (
          <BasketItem key={index} product={product} />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-[2px] bg-bgGray my-5"></View>
        )}
        ListFooterComponent={Footer}
      />
    </View>
  );
}

const BasketItem = memo(
  ({product}: any) => {
    const subList = formatToBasket(product);
    const dispatch = useAppDispatch();

    function removeItem() {
      dispatch(removeFromBasket(product));
    }

    function changeQuantityBy(val: number) {
      dispatch(changeBasketItemQuantity({product, changeVal: val}));
    }

    return (
      <View className="flex">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <FastImage
              style={{borderWidth: 2, borderColor: 'white'}}
              className="w-14 bg-gray-100 shadow-md h-14 rounded-full"
              source={{uri: product.image_url}}
            />
            <View className="ml-4">
              <AppText className="font-bold ">{product.name}</AppText>
              <AppText className="font-bold">$ {product.price.dine_in}</AppText>
            </View>
          </View>
          <TouchableOpacity onPress={removeItem} className="p-2">
            <FastImage className="h-3 w-3" source={CloseIcon} />
          </TouchableOpacity>
        </View>
        <View className="pl-4">
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
          <View className="flex-row items-center justify-between mt-6">
            <View>
              <AppText className="font-bold text-lg">
                $ {calcProductTotalPrice(product)}
              </AppText>
            </View>
            <View
              style={{borderWidth: 1, borderColor: colors.gray}}
              className={`h-12 py-2  flex-row items-center bg-white  rounded-lg`}>
              <TouchableOpacity
                onPress={() => changeQuantityBy(-1)}
                className={`h-full  w-12  justify-center  `}>
                <AppText className="text-center">-</AppText>
              </TouchableOpacity>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <AppText className="w-10 text-center">
                {product.quantity || 0}
              </AppText>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <TouchableOpacity
                onPress={() => changeQuantityBy(1)}
                className={`rounded  h-full  w-12 justify-center  `}>
                <AppText className="text-center">+</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
        <AppText>{item.name}</AppText>
      </View>
      <AppText>$ {item.price}</AppText>
    </View>
  );
}

function Footer() {
  const navigation = useMainNavigation();
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;

  let totalPriceSum: number = calcBasketTotalPriceSum(basketList);
  let isButtonDisabled = totalPriceSum <= 0;

  return (
    <View className="my-6">
      <AppButton
        isDisabled={isButtonDisabled}
        onPress={() => {
          if (isButtonDisabled) return;
          navigation.navigate('Payment');
        }}
        text="Pay"
      />
    </View>
  );
}

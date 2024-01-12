import AppText from '@components/AppText';
import React, {memo, useEffect, useState} from 'react';
import {ScrollView, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {HasParamsScreen} from '@navigators/MainNavigator';
import {useGetMenuQuery} from '@store/services/api';
import {useAppDispatch, useAppSelector} from '@store/index';
import LoadingView from '@components/LoadingView';
import FastImage from 'react-native-fast-image';
import AppLinear from '@components/AppLinear';
import colors from '@constants/colors';
import AppButton from '@components/AppButton';
import {setBasket} from '@store/slices/basket';
import {
  changeModifierItem,
  getModiferItemsWithQuantity,
  resetModifier,
} from '@utils/helpers';

export default function ProductDetail({
  route,
}: HasParamsScreen): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  const [product, setProduct] = useState<any>(null);
  const {id} = route.params;

  let {
    data: menu,
    isLoading,
    isSuccess,
  } = useGetMenuQuery({
    outletId: user?.outletId,
  });

  useEffect(() => {
    if (menu) {
      setProduct(menu.allProductsHash[id]);
    }
  }, [menu]);

  if (isLoading || !isSuccess || product === null) {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        className="px-screenPadding flex-1 bg-white relative"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        ListHeaderComponent={() => (
          <View className="flex-row items-center">
            {product.image_url ? (
              <FastImage
                style={{
                  width: 60,
                  height: 60,
                }}
                className="rounded-full border-white border-2 shadow-md"
                source={{uri: product.image_url}}
              />
            ) : (
              <View></View>
            )}
            <View className="ml-5">
              <AppText className="text-black text-[20px]">
                {product.name}
              </AppText>
              <AppText className="text-[12px]">{product.name}</AppText>
              <AppText className="font-bold text-[20px] text-black">
                ${product.price.dine_in}
              </AppText>
            </View>
          </View>
        )}
        data={product.modifier_list}
        renderItem={({item: modifier}) => (
          <Modifier modifier={modifier} setProduct={setProduct} />
        )}
      />
      <Footer product={product} />
    </View>
  );
}

function Modifier({modifier, setProduct}: any) {
  const totalQuantity = modifier.modifier_value_list.reduce(
    (total: number, current: any) => total + current.quantity,
    0,
  );

  function handleReset() {
    setProduct((prevProduct: any) =>
      resetModifier({product: prevProduct, modifier}),
    );
  }

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <AppText className="text-black">{modifier.name.en_US}</AppText>
          {modifier.min_quantity >= 1 && (
            <View className="flex-row ml-2">
              <AppText className="text-primary font-bold">Must </AppText>
              <AppText className="text-black ">
                ({totalQuantity}/{modifier.min_quantity})
              </AppText>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleReset} className="p-1">
          <AppText className="text-textGray font-bold">Reset Choice</AppText>
        </TouchableOpacity>
      </View>
      {
        <FlatList
          className="mt-1"
          ItemSeparatorComponent={() => <View className="w-4"></View>}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          data={modifier.modifier_value_list}
          renderItem={({item: modifierItem}) => (
            <ModifierItem
              modifierItem={modifierItem}
              modifier={modifier}
              setProduct={setProduct}
              totalQuantity={totalQuantity}
            />
          )}
        />
      }
    </View>
  );
}

const ModifierItem = memo(
  ({modifierItem, modifier, setProduct, totalQuantity}: any) => {
    function handleModifierChange(modifierItem: any) {
      if (modifierItem.quantity >= modifierItem.max_quantity) return;
      if (totalQuantity >= modifier.max_quantity) return;

      setProduct((prevProduct: any) =>
        changeModifierItem({product: prevProduct, modifierItem}),
      );
    }
    return (
      <AppLinear
        color={modifierItem.quantity ? '' : colors.gray}
        className="min-w-[140px] p-2 px-3 rounded-lg">
        <TouchableOpacity onPress={() => handleModifierChange(modifierItem)}>
          <AppText
            className={`${
              modifierItem.quantity ? 'text-white' : 'text-textGray'
            }`}>
            {modifierItem.name.en_US}
          </AppText>
          <View className="flex-row mt-1 justify-between">
            {!modifier.isModifierSingle ? (
              <AppText
                className={`${
                  modifierItem.quantity ? 'text-white' : 'text-black'
                } `}>
                QTY {modifierItem.quantity}/{modifierItem.max_quantity}
              </AppText>
            ) : (
              <View></View>
            )}
            <AppText
              className={`${
                modifierItem.quantity ? 'text-white' : 'text-black'
              }  text-right font-bold`}>
              ${modifierItem.price ? modifierItem.price.dine_in : 0}
            </AppText>
          </View>
        </TouchableOpacity>
      </AppLinear>
    );
  },
  (prev, last) =>
    prev.modifierItem.quantity === last.modifierItem.quantity &&
    prev.totalQuantity === last.totalQuantity,
);

function Footer({product}: any) {
  const [prices, setPrices] = useState<number[]>([]);

  useEffect(() => {
    if (product) {
      let prices: number[] = [];

      const modifierItemsWithQuantity = getModiferItemsWithQuantity(
        product.modifier_list,
      );

      const modifierPrices = modifierItemsWithQuantity.map(
        (mItem: any) => mItem.price.dine_in * mItem.quantity,
      );

      prices = [product.price.dine_in, ...modifierPrices];

      setPrices(prices);
    }
  }, [product]);

  const dispatch = useAppDispatch();

  function handleAdd() {
    const modifierItemsWithQuantity = getModiferItemsWithQuantity(
      product.modifier_list,
    );

    console.log(modifierItemsWithQuantity);

    dispatch(setBasket({basketList: [], total: 100}));
  }

  const totalPrice = prices.reduce(
    (result: number, current: number) => result + current,
    0,
  );

  return (
    <View
      style={{borderTopColor: colors.gray, borderTopWidth: 2}}
      className="px-screenPadding bg-white  py-2 ">
      <AppText>Total:</AppText>
      <AppText className="font-bold text-black text-[20px]">
        {prices.map(
          (price: number, index: number) =>
            `${price.toFixed(2)}$${index < prices.length - 1 ? ' + ' : ''}`,
        )}
      </AppText>
      <View className="mt-4">
        <AppButton onPress={handleAdd} text={`Add ${totalPrice.toFixed(2)}$`} />
      </View>
    </View>
  );
}

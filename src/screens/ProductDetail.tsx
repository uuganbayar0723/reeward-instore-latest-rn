import AppText from '@components/AppText';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {HasParamsScreen} from '@navigators/MainNavigator';
import {useGetMenuQuery} from '@store/services/api';
import {useAppSelector} from '@store/index';
import LoadingView from '@components/LoadingView';
import FastImage from 'react-native-fast-image';
import AppLinear from '@components/AppLinear';
import colors from '@constants/colors';

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
    <FlatList
      className="px-screenPadding bg-white"
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
            <AppText className="text-black text-[20px]">{product.name}</AppText>
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
  );
}

function Modifier({modifier, setProduct}: any) {
  const totalQuantity = modifier.modifier_value_list.reduce(
    (total: number, current: any) => total + current.quantity,
    0,
  );

  function handleModifierChange(modifierItem: any) {
    if (modifierItem.quantity >= modifierItem.max_quantity) return;
    if (totalQuantity >= modifier.max_quantity) return;

    setProduct((prevProduct: any) => ({
      ...prevProduct,
      modifier_list: prevProduct.modifier_list.map((modifierLocal: any) => ({
        ...modifierLocal,
        modifier_value_list: modifierLocal.modifier_value_list.map(
          (modifierItemLocal: any) => ({
            ...modifierItemLocal,
            quantity:
              modifierItem._id === modifierItemLocal._id
                ? modifierItemLocal.quantity + 1
                : modifierItemLocal.quantity,
          }),
        ),
      })),
    }));
  }

  function handleReset() {
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      modifier_list: prevProduct.modifier_list.map((modifierLocal: any) => ({
        ...modifierLocal,
        modifier_value_list: modifierLocal.modifier_value_list.map(
          (modifierItemLocal: any) => ({
            ...modifierItemLocal,
            quantity:
              modifier._id === modifierLocal._id
                ? 0
                : modifierItemLocal.quantity,
          }),
        ),
      })),
    }));
  }

  return (
    <View className="mt-4">
      <View className="flex-row justify-between">
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
        <TouchableOpacity onPress={handleReset} className="bg-red-10-">
          <AppText className="text-textGray font-bold">Reset Choice</AppText>
        </TouchableOpacity>
      </View>
      {
        <FlatList
          className="mt-2"
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          data={modifier.modifier_value_list}
          renderItem={({item: modifierItem}) => (
            <AppLinear
              color={modifierItem.quantity ? '' : colors.gray}
              className="w-40 p-2 px-3 rounded-lg mr-5">
              <TouchableOpacity
                onPress={() => handleModifierChange(modifierItem)}>
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
                    {modifier.price ? modifier.price?.dine_in : '$0'}
                  </AppText>
                </View>
              </TouchableOpacity>
            </AppLinear>
          )}
        />
      }
    </View>
  );
}

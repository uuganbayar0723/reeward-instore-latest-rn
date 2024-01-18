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
import AppButton, {ButtonHeights} from '@components/AppButton';
import {addToBasket, setBasket} from '@store/slices/basket';
import {
  changeModifierItem,
  getModiferItemsWithQuantity,
  resetModifier,
} from '@utils/helpers';
import {useNavigation} from '@react-navigation/native';

export default function ProductDetail({
  route,
}: HasParamsScreen): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  const [product, setProduct] = useState<any>(null);
  const {id} = route.params;

  console.log(product)

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
      <View className="flex-1 justify-center">
        <LoadingView />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-screenPadding">
        <Header product={product} />
      </View>
      <View className="flex-1">
        {product.modifier_list.length ? (
          <FlatList
            className="px-screenPadding flex-1  relative"
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            data={product.modifier_list}
            renderItem={({item: modifier}) => (
              <Modifier modifier={modifier} setProduct={setProduct} />
            )}
          />
        ) : (
          <></>
        )}
        {product.bundled_item_list.length ? (
          <Bundle product={product} setProduct={setProduct} />
        ) : (
          <></>
        )}
      </View>
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
  const navigation = useNavigation();

  function handleAdd() {
    const modifierItemsWithQuantity = getModiferItemsWithQuantity(
      product.modifier_list,
    );

    dispatch(addToBasket({product, modifierItemsWithQuantity}));
    navigation.goBack();
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
            `$${price.toFixed(2)}${index < prices.length - 1 ? ' + ' : ''}`,
        )}
      </AppText>
      <View className="mt-4">
        <AppButton onPress={handleAdd} text={`Add $${totalPrice.toFixed(2)}`} />
      </View>
    </View>
  );
}

function Header({product}: any) {
  return (
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
  );
}

function Bundle({product, setProduct}: any) {
  let user = useAppSelector(state => state.user.userState);

  let {
    data: menu,
    isLoading,
    isSuccess,
    isFetching,
    error,
  } = useGetMenuQuery({
    outletId: user?.outletId,
  });

  const {bundled_item_list} = product;
  const [activeBundleItemId, setActiveBundleItemId] = useState<string>(
    bundled_item_list[0]._id,
  );
  const [activeBundleItemList, setActiveBundleItemList] = useState<any>([]);
  const [isTabChangeLoading, setIsTabChangeLoading] = useState<boolean>(true);

  function getActiveList() {
    const activeBundleItem = bundled_item_list.filter(
      (b: any) => b._id === activeBundleItemId,
    )[0];
    return activeBundleItem?.product_list || [];
  }

  useEffect(() => {
    if (isTabChangeLoading && bundled_item_list) {
      setActiveBundleItemList(getActiveList());
      setIsTabChangeLoading(false);
    }
  }, [activeBundleItemId, isTabChangeLoading]);

  useEffect(() => {
    setActiveBundleItemList(getActiveList());
  }, [bundled_item_list]);

  return (
    <>
      <ScrollView
        className="px-screenPadding flex-grow-0"
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {product.bundled_item_list.map((b: any, index: string) => (
          <View key={b.id} className="mr-4 pt-2">
            <AppButton
              buttonHeight={ButtonHeights.Small}
              isDisabled={activeBundleItemId !== b._id}
              onPress={() => {
                if (activeBundleItemId === b._id) return;
                setActiveBundleItemId(b._id);
                setIsTabChangeLoading(true);
              }}
              text={b.name.en_US}
            />
          </View>
        ))}
      </ScrollView>
      <FlatList
        className="px-screenPadding flex-1 bg-white relative"
        contentContainerStyle={{paddingBottom: 10}}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={1}
        data={isTabChangeLoading ? [] : activeBundleItemList}
        ListEmptyComponent={
          <View className="h-44 justify-center">
            <LoadingView />
          </View>
        }
        renderItem={({item: bundleItem}) => (
          <BundleProduct
            bundleProduct={menu.allProductsHash[bundleItem.product_id]}
            bundleItem={bundleItem}
            setProduct={setProduct}
          />
        )}
      />
    </>
  );
}

const BundleProduct = memo(
  ({bundleProduct: b, bundleItem, setProduct}: any) => {
    const [bundleProduct, setBundleProduct] = useState({...b});
    const [isModifierVisible, setIsModifierVisible] = useState<boolean>(false);
    const modifierLength = bundleProduct.modifier_list.length;

    function addToBundle() {
      setProduct((prevProduct: any) => ({
        ...prevProduct,
        bundled_item_list: prevProduct.bundled_item_list.map(
          (bundleItemLocal: any) => ({
            ...bundleItemLocal,
            product_list: bundleItemLocal.product_list.map(
              (bundleProductLocal: any) => ({
                ...bundleProductLocal,
                quantity:
                  bundleProductLocal._id === bundleItem._id
                    ? bundleProductLocal.quantity + 1
                    : bundleProductLocal.quantity,
                modifier_list:
                  bundleProductLocal._id === bundleItem._id
                    ? bundleProduct.modifier_list
                    : bundleProductLocal.modifier_list,
              }),
            ),
          }),
        ),
      }));
    }

    return (
      <View
        className={`w-full  mt-2 rounded-lg p-2 ${
          modifierLength && 'border-gray-300 border '
        } `}>
        <View className="flex-row">
          <View className="rounded-lg flex-1 flex-row items-center bg-bgGray p-2 pl-4 justify-between">
            <View>
              <AppText style={{maxWidth: 160}}>{bundleProduct.name}</AppText>
              <AppText className="font-bold mt-1">
                ${bundleProduct.price.dine_in}
              </AppText>
            </View>
            <View
              className={` h-12 py-2 flex-row items-center ml-5 bg-white rounded-lg`}>
              <TouchableOpacity className={`h-full  w-12  justify-center  `}>
                <AppText className="text-center">-</AppText>
              </TouchableOpacity>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <AppText className="w-10 text-center">
                {bundleItem.quantity || 0}
              </AppText>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <TouchableOpacity
                onPress={addToBundle}
                className={`rounded  h-full  w-12 justify-center  `}>
                <AppText className="text-center">+</AppText>
              </TouchableOpacity>
            </View>
          </View>
          {modifierLength ? (
            <TouchableOpacity
              onPress={() => setIsModifierVisible(prev => !prev)}
              className="w-12 items-center justify-center ">
              <AppText>V</AppText>
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        {isModifierVisible ? (
          <FlatList
            className="flex-1  relative"
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            data={bundleProduct.modifier_list}
            renderItem={({item: modifier}) => (
              <Modifier modifier={modifier} setProduct={setBundleProduct} />
            )}
          />
        ) : (
          <View></View>
        )}
      </View>
    );
  },

  (prev, last) => prev.bundleItem.quantity === last.bundleItem.quantity,
);

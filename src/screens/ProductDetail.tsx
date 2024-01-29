import AppText from '@components/AppText';
import React, {memo, useCallback, useEffect, useState} from 'react';
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
  calcBundleItemTotalQuantity,
  calcIsModifierMinQuantityReached,
  calcModifierTotalPrice,
  calcModifierTotalQuantity,
  changeBundleItem,
  changeModifierItem,
  getBundleItemsWithQuantity,
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

function Footer({product}: any) {
  let user = useAppSelector(state => state.user.userState);

  let {data: menu} = useGetMenuQuery({
    outletId: user?.outletId,
  });
  const [prices, setPrices] = useState<number[]>([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (product) {
      const {bundled_item_list, modifier_list, price} = product;
      let prices: number[] = [price.dine_in];

      if (modifier_list.length) {
        const modifierItemsWithQuantity = getModiferItemsWithQuantity(product);

        const modifierPrices = modifierItemsWithQuantity
          .map((mItem: any) => mItem.price.dine_in * mItem.quantity)
          .filter((price: number) => price);

        prices = [...prices, ...modifierPrices];

        if (calcIsModifierMinQuantityReached(modifier_list)) {
          setIsAddButtonDisabled(false);
        } else {
          setIsAddButtonDisabled(true);
        }
      }

      if (bundled_item_list.length) {
        let bundleProductsWithQuantity = getBundleItemsWithQuantity(product);

        let bundleItemPrices = bundleProductsWithQuantity
          .map((b: any) => {
            const totalPriceSum = b.bProduct.modifier_list.reduce(
              (result: number, current: any) =>
                result + calcModifierTotalPrice(current),
              0,
            );
            return b.quantity * (b.price.dine_in + totalPriceSum);
          })
          .filter((p: number) => p);

        prices = [...prices, ...bundleItemPrices];
        const minQuantityNotReachedLength = bundled_item_list.filter(
          (b: any) => b.min_quantity > calcBundleItemTotalQuantity(b),
        ).length;
        if (minQuantityNotReachedLength === 0) {
          setIsAddButtonDisabled(false);
        } else {
          setIsAddButtonDisabled(true);
        }
      }

      if (modifier_list.length === 0 && bundled_item_list.length === 0) {
        setIsAddButtonDisabled(false);
      }
      setPrices(prices);
    }
  }, [product]);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  function handleAdd() {
    const {bundled_item_list, modifier_list} = product;

    if (isAddButtonDisabled) return;
    if (modifier_list) {
      const modifierItemsWithQuantity = getModiferItemsWithQuantity(product);
    }

    dispatch(addToBasket(product));
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
        <AppButton
          isDisabled={isAddButtonDisabled}
          onPress={handleAdd}
          text={`Add $${totalPrice.toFixed(2)}`}
        />
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

  let {data: menu} = useGetMenuQuery({
    outletId: user?.outletId,
  });

  const {bundled_item_list} = product;
  const [activeBundleItem, setActiveBundleItem] = useState<any>(
    bundled_item_list[0],
  );
  const [isTabChangeLoading, setIsTabChangeLoading] = useState<boolean>(true);

  function getActiveItem() {
    const activeBundleItem_l = bundled_item_list.filter(
      (b: any) => b._id === activeBundleItem._id,
    )[0];
    return activeBundleItem_l;
  }

  useEffect(() => {
    if (isTabChangeLoading && bundled_item_list) {
      setActiveBundleItem(getActiveItem());
      setIsTabChangeLoading(false);
    }
  }, [activeBundleItem, isTabChangeLoading]);

  useEffect(() => {
    setActiveBundleItem(getActiveItem());
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
              isDisabled={activeBundleItem._id !== b._id}
              onPress={() => {
                if (activeBundleItem._id === b._id) return;
                setActiveBundleItem(b);
                setIsTabChangeLoading(true);
              }}
              text={b.name.en_US}
            />
          </View>
        ))}
      </ScrollView>

      <FlatList
        className="px-screenPadding flex-1 bg-white relative"
        ListHeaderComponent={() => (
          <View className="flex-row mt-1">
            {activeBundleItem.min_quantity > 0 && (
              <AppText className="text-primary font-bold">
                Min quantity({activeBundleItem.min_quantity})
              </AppText>
            )}
            <AppText className="ml-1">
              ({calcBundleItemTotalQuantity(activeBundleItem)}/
              {activeBundleItem.max_quantity})
            </AppText>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 10}}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={1}
        data={isTabChangeLoading ? [] : activeBundleItem.product_list}
        ListEmptyComponent={
          <View className="h-44 justify-center">
            <LoadingView />
          </View>
        }
        renderItem={({item: bundleListItem}) => (
          <BundleProduct
            bundleProduct={menu.allProductsHash[bundleListItem.product_id]}
            bundleListItem={bundleListItem}
            setProduct={setProduct}
            activeBundleItem={activeBundleItem}
          />
        )}
      />
    </>
  );
}

const BundleProduct = memo(
  ({bundleProduct: b, bundleListItem, setProduct, activeBundleItem}: any) => {
    const [bundleProduct, setBundleProduct] = useState({...b});
    const [isModifierVisible, setIsModifierVisible] = useState<boolean>(false);
    const modifierLength = bundleProduct.modifier_list.length;


    function changeToBundle(changeVal: number) {
      const {quantity, max_quantity} = bundleListItem;
      const {max_quantity: bundleMaxQuantity} = activeBundleItem;
      const {modifier_list} = bundleProduct;

      const totalQuantity = calcBundleItemTotalQuantity(activeBundleItem);

      if (quantity === 0 && changeVal < 0) return;
      if (totalQuantity + changeVal > bundleMaxQuantity) return;
      if (quantity + changeVal > max_quantity) return;
      if (!calcIsModifierMinQuantityReached(modifier_list)) return;

      setProduct((prevProduct: any) =>
        changeBundleItem({
          product: prevProduct,
          val: quantity + changeVal,
          bundleListItem,
          bundleProduct,
        }),
      );
    }

    function onModifierChange() {
      setProduct((prevProduct: any) =>
        changeBundleItem({
          product: prevProduct,
          val: 0,
          bundleListItem,
          bundleProduct,
        }),
      );
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
                ${bundleListItem.price.dine_in}
              </AppText>
            </View>
            <View
              className={` h-12 py-2 flex-row items-center ml-5 bg-white rounded-lg`}>
              <TouchableOpacity
                onPress={() => changeToBundle(-1)}
                className={`h-full  w-12  justify-center  `}>
                <AppText className="text-center">-</AppText>
              </TouchableOpacity>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <AppText className="w-10 text-center">
                {bundleListItem.quantity || 0}
              </AppText>
              <View className="h-full w-[1px] bg-gray-300"></View>
              <TouchableOpacity
                onPress={() => changeToBundle(1)}
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
              <Modifier
                onModifierChange={onModifierChange}
                modifier={modifier}
                setProduct={setBundleProduct}
              />
            )}
          />
        ) : (
          <View></View>
        )}
      </View>
    );
  },
);

function Modifier({modifier, setProduct, onModifierChange}: any) {
  function handleReset() {
    setProduct((prevProduct: any) =>
      resetModifier({product: prevProduct, modifier}),
    );
    if (onModifierChange) {
      onModifierChange();
    }
  }

  const totalQuantity = calcModifierTotalQuantity(modifier);

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <AppText className="text-black">{modifier.name.en_US}</AppText>
          <View className="flex-row ml-2">
            {modifier.min_quantity >= 1 && (
              <AppText className="text-primary font-bold">
                Min quantity({modifier.min_quantity})
              </AppText>
            )}
            <AppText className="text-black ml-1 ">
              ({totalQuantity}/{modifier.max_quantity})
            </AppText>
          </View>
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
              onModifierChange={onModifierChange}
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
  ({
    modifierItem,
    modifier,
    setProduct,
    totalQuantity,
    onModifierChange,
  }: any) => {
    function handleModifierChange(modifierItem: any) {
      if (modifierItem.quantity >= modifierItem.max_quantity) return;
      if (totalQuantity >= modifier.max_quantity) return;

      setProduct((prevProduct: any) =>
        changeModifierItem({product: prevProduct, modifier, modifierItem}),
      );
      if (onModifierChange) {
        onModifierChange();
      }
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

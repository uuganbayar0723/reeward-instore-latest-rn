import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppButton, {ButtonHeights} from '@components/AppButton';
import {useAppDispatch, useAppSelector} from '@store/index';
import {useGetMenuQuery} from '@store/services/api';
import FastImage from 'react-native-fast-image';
import colors from '@constants/colors';
import {useMainNavigation} from '@navigators/MainNavigator';
import LoadingView from '@components/LoadingView';
import AppLinear from '@components/AppLinear';
import AppText from '@components/AppText';
import Basketicon from '@assets/icons/basket.png';
import {addToBasket, changeBasketItemQuantity} from '@store/slices/basket';

const IMAGE_SIZE = 110;

function NewSale(): React.JSX.Element {
  let auth = useAppSelector(state => state.auth.data);
  
  const navigation = useMainNavigation();

  let {
    data: menu,
    isLoading,
    isSuccess,
  } = useGetMenuQuery({
    outletId: auth.user.outlet.id,
  });

  let categories: any;
  let allProductsHash: any;

  if (menu) {
    categories = menu.categories;
    allProductsHash = menu.allProductsHash;
  }

  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    if (products.length === 0 && categories) {
      const activeCategory = categories.filter(
        (c: any) => c.id === activeCategoryId,
      )[0];

      const product_list = activeCategory?.product_list || [];

      setProducts(product_list);
    }
  }, [activeCategoryId, products]);

  useEffect(() => {
    if (categories) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories]);

  return (
    <View className="flex-1 bg-bgGray pt-screenTop">
      {isLoading || !isSuccess ? (
        <View className="flex-1 justify-center">
          <LoadingView />
        </View>
      ) : (
        <View>
          <View className="px-screenPadding flex-row justify-between items-center">
            <AppText className="text-[24px] font-bold text-black">
              New Sale
            </AppText>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Basket')}
                className="p-3 bg-white rounded-full">
                <FastImage className="w-6 h-6" source={Basketicon} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            className="px-screenPadding pt-2 flex-shrink-0"
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {categories.map((c: any, index: string) => (
              <View key={c.id} className="mr-4">
                <AppButton
                  buttonHeight={ButtonHeights.Small}
                  isDisabled={activeCategoryId !== c.id}
                  onPress={() => {
                    if (activeCategoryId === c.id) return;
                    setActiveCategoryId(c.id);
                    setProducts([]);
                  }}
                  text={c.name}
                />
              </View>
            ))}
          </ScrollView>
          <FlatList
            className="mb-[95px] px-screenPadding"
            data={products}
            keyExtractor={item => item.id}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            numColumns={2}
            renderItem={({item: product, index}) => (
              <Product product={product} />
            )}
            ListEmptyComponent={
              <ActivityIndicator color={colors.primary} className="h-44" />
            }
          />
        </View>
      )}
    </View>
  );
}

const Product = memo(
  ({product}: any) => {
    const navigation = useMainNavigation();

    const dispatch = useAppDispatch();

    function increaseQuantity() {
      if (product.modifier_list.length || product.bundled_item_list.length) {
        navigation.navigate('ProductDetail', {id: product.id});
        return;
      }

      dispatch(addToBasket(product));
    }

    return (
      <View className="w-1/2 p-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductDetail', {id: product.id});
          }}
          activeOpacity={0.8}
          className="relative">
          {product.image_url ? (
            <View
              style={{
                transform: [{translateX: -(IMAGE_SIZE / 2)}],
                borderWidth: 4,
              }}
              className="rounded-full absolute z-20 left-1/2  border-white ">
              <FastImage
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                }}
                className="rounded-full "
                source={{uri: product.image_url}}
              />
            </View>
          ) : (
            <View
              style={{
                transform: [{translateX: -(IMAGE_SIZE / 2)}],
                borderWidth: 4,
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
              }}
              className="rounded-full absolute z-20 left-1/2  border-white ">
              <View className="flex-1 bg-bgGray rounded-full items-center justify-center">
                <AppText className="font-bold">No Image</AppText>
              </View>
            </View>
          )}
          <View className="bg-white rounded-xl mt-8 pt-24 px-4 pb-4">
            <Text
              numberOfLines={2}
              className="text-center h-14 text-[#454857] text-[16px]">
              {product.name}
            </Text>
            <View className="w-full h-[0.5px] bg-[#252836]"></View>
            <View className="flex-row justify-between items-center mt-4">
              <Text className={`text-[#1F1D2B] `}>{product.price.dine_in}</Text>
              <AppLinear
                style={{shadowColor: '#1F1D2B'}}
                className="rounded-xl  w-10 h-10 shadow-lg">
                <TouchableOpacity
                  onPress={increaseQuantity}
                  className="flex-1 justify-center items-center">
                  <Text className="text-white">+</Text>
                </TouchableOpacity>
              </AppLinear>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  (prev, last) => prev.product.name === last.product.name,
);

export default NewSale;

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
import AppButton from '@components/AppButton';
import {useAppSelector} from '@store/index';
import {useGetMenuQuery} from '@store/services/api';
import FastImage from 'react-native-fast-image';
import colors from '@constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '@navigators/MainNavigator';
import LoadingView from '@components/LoadingView';

const IMAGE_SIZE = 110;

function NewSale(): React.JSX.Element {
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
    <View className="flex-1">
      {isLoading || !isSuccess ? (
        <View className="flex-1 justify-center">
          <LoadingView />
        </View>
      ) : (
        <View>
          <ScrollView
            className="px-4"
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {categories.map((c: any, index: string) => (
              <View key={c.id} className="my-2 mr-4">
                <AppButton
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
            className="mb-14"
            data={products}
            keyExtractor={item => item.id}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            numColumns={2}
            renderItem={({item: p, index}) => <Product p={p} />}
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
  ({p}: any) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    return (
      <View className="w-1/2 p-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductDetail', {id: p.id});
          }}
          activeOpacity={0.8}
          className="relative">
          {p.image_url && (
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
                source={{uri: p.image_url}}
              />
            </View>
          )}
          <View className="bg-white rounded-xl mt-8 pt-24 px-4 pb-4">
            <Text
              numberOfLines={2}
              className="text-center h-14 text-[#454857] text-[16px]">
              {p.name}
            </Text>
            <View className="w-full h-[0.5px] bg-[#252836]"></View>
            <View className="flex-row justify-between items-center mt-4">
              <Text className={`text-[#1F1D2B] `}>{p.price.dine_in}</Text>
              <LinearGradient
                start={{x: 0.0, y: 0}}
                end={{x: 1, y: 1}}
                colors={['#EB4689', '#FD6A6B']}
                style={{shadowColor: '#1F1D2B'}}
                className="rounded-xl  w-10 h-10 shadow-lg">
                <TouchableOpacity className="flex-1 justify-center items-center">
                  <Text className="text-white">+</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  (prev, last) => prev.p.name === last.p.name,
);

export default NewSale;

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

const IMAGE_SIZE = 110;

function NewSale(): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  let {data, isLoading, isFetching, error} = useGetMenuQuery({
    outletId: user?.outletId,
  });

  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [products, setProducts] = useState<any>([]);

  let formattedData = data?.category_list
    .filter((c: any) => c._id && c.name && c.product_list.length)
    .map((c: any) => {
      return {
        name: c.name.en_US,
        id: c._id,
        product_list: c.product_list.map((p: any) => ({
          categoryId: c._id,
          name: p.name.en_US,
          price: p.price,
          id: p._id,
          image_url: p.image_url || '',
          productType: p.productType,
          modifier_list: p.modifier_list,
          remaining_quantity: p.remaing_quantity,
          color: p.color,
        })),
      };
    });

  let productsFormatted = formattedData?.reduce(
    (result: any, obj: any) => [...result, ...obj.product_list],
    [],
  );

  useEffect(() => {
    if (products.length === 0 && productsFormatted) {
      const filtered = productsFormatted.filter(
        (p: any) => p.categoryId === activeCategoryId,
      );

      setProducts(filtered);
    }
  }, [activeCategoryId, products]);

  useEffect(() => {
    if (formattedData) {
      setActiveCategoryId(formattedData[0].id);
    }
  }, [data]);

  return (
    <View>
      {isLoading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="pb-28">
          <ScrollView
            className="px-4"
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {formattedData.map((c: any, index: string) => (
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
            data={products}
            keyExtractor={item => item.id}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            numColumns={2}
            renderItem={({item: p, index}) => (
              <Product
                name={p.name}
                price={p.price.dine_in}
                image_url={p.image_url}
                p={p}
              />
            )}
            ListEmptyComponent={<ActivityIndicator className='h-44' />}
          />
        </View>
      )}
    </View>
  );
}

function EmptyProduct() {
  return (
    <View className="w-full flex-row flex-wrap">
      <View className="w-1/2 p-2">
        <View className="bg-gray-200 h-56 rounded-xl"></View>
      </View>
      <View className="w-1/2 p-2">
        <View className="bg-gray-200 h-56 rounded-xl"></View>
      </View>
      <View className="w-1/2 p-2">
        <View className="bg-gray-200 h-56 rounded-xl"></View>
      </View>
      <View className="w-1/2 p-2">
        <View className="bg-gray-200 h-56 rounded-xl"></View>
      </View>
    </View>
  );
}

const Product = memo(
  ({name, price, image_url}: any) => {
    return (
      <View className="w-1/2 p-2">
        <TouchableOpacity activeOpacity={0.8} className="relative">
          {image_url && (
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
                source={{uri: image_url}}
              />
            </View>
          )}
          <View className="bg-white rounded-xl mt-8 pt-24 px-4 pb-4">
            <Text
              numberOfLines={2}
              className="text-center h-14 text-[#454857] text-[16px]">
              {name}
            </Text>
            <View className="w-full h-[0.5px] bg-[#252836]"></View>
            <View className="flex-row justify-between items-center mt-4">
              <Text className={`text-[#1F1D2B] `}>{price}</Text>
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
  (prev, last) => prev.name === last.name,
);

export default NewSale;

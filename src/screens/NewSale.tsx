import React, {useEffect} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '@components/AppButton';
import {useAppSelector} from '@store/index';
import {useGetMenuQuery} from '@store/services/api';

const IMAGE_SIZE = 110;

function NewSale(): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  let {data, isLoading, isFetching, error} = useGetMenuQuery({
    outletId: user?.outletId,
  });
  // console.log({data})

  let categories = data?.category_list
    .filter((c: any) => c._id && c.name)
    .map((c: any) => {
      return {
        name: c.name.en_US,
        id: c._id,
        product_list: c.product_list.map((p: any) => ({
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

  let products = categories?.reduce(
    (result: any, obj: any) => [...result, ...obj.product_list],
    [],
  );
  // console.log(products);
  // console.log({pruducts});

  return (
    <View className="flex-1">
      <FlatList
        data={products}
        // className='flex-row flex-wrap'
        numColumns={2}
        renderItem={({item: p, index}) => (
          <View className='w-1/2 p-2'>
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              className="relative">
              <View
                style={{
                  transform: [{translateX: -(IMAGE_SIZE / 2)}],
                  borderWidth: 4,
                }}
                className="rounded-full absolute z-20 left-1/2  border-white ">
                {p.image_url && (
                  <Image
                    style={{
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                    }}
                    className="rounded-full "
                    source={{uri: p.image_url}}
                  />
                )}
              </View>
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
                      <Text className='text-white'>+</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default NewSale;

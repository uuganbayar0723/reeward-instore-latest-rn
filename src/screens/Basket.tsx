import AppText from '@components/AppText';
import {useAppSelector} from '@store/index';
import {formatToBasket, getBundleItemsWithQuantity} from '@utils/helpers';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import colors from '@constants/colors';

export default function Basket() {
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;

  return (
    <View className="bg-white  flex-1">
      <FlatList
        className="px-screenPadding"
        data={basketList || []}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index) => `${item.id}${index}`}
        renderItem={({item: product, index}) => (
          <BasketItem key={index} product={product} />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-bgGray my-5"></View>
        )}
      />
    </View>
  );
}

function BasketItem({product}: any) {
  // console.log(product.bundled_item_list)
  // console.log(getBundleItemsWithQuantity(product));
  const subList = formatToBasket(product);

  return (
    <View className="flex-row">
      <FastImage
        style={{borderWidth: 2, borderColor: 'white'}}
        className="w-14 bg-gray-100 shadow-md h-14 rounded-full"
        source={{uri: product.image_url}}
      />
      <View className="pl-4 flex-1">
        <AppText className='font-bold'>{product.name}</AppText>
        {/* <AppText className="text-[12px]">{product.name}</AppText> */}
        <FlatList
          className="mt-4"
          data={subList}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
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
        <View
          style={{borderWidth: 1, borderColor: colors.gray}}
          className={`h-12 self-end py-2 mt-6 flex-row items-center bg-white  rounded-lg`}>
          <TouchableOpacity
            // onPress={() => changeToBundle(-1)}
            className={`h-full  w-12  justify-center  `}>
            <AppText className="text-center">-</AppText>
          </TouchableOpacity>
          <View className="h-full w-[1px] bg-gray-300"></View>
          <AppText className="w-10 text-center">
            {product.quantity || 0}
          </AppText>
          <View className="h-full w-[1px] bg-gray-300"></View>
          <TouchableOpacity
            // onPress={() => changeToBundle(1)}
            className={`rounded  h-full  w-12 justify-center  `}>
            <AppText className="text-center">+</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function BasketItemDetail({item}: any) {
  console.log(item);
  return (
    <View className="flex-row justify-between ">
      <AppText>{item.quantity}</AppText>
      <AppText>{item.name}</AppText>
      <AppText>{item.price}</AppText>
    </View>
  );
}

import AppText from '@components/AppText';
import {useAppSelector} from '@store/index';
import {FlatList, View} from 'react-native';

export default function Basket() {
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;

  return (
    <View className="bg-white px-screenPadding flex-1">
      <AppText>Basket</AppText>
      <FlatList
        data={basketList || []}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index: number) => `${item.id}${index}`}
        renderItem={({item: product, index}) => <BasketItem key={index} product={product} />}
      />
    </View>
  );
}

function BasketItem({product}: any) {
  return (
    <View>
      <AppText className="text-black">
        {product.name} {product.quantity}
      </AppText>
    </View>
  );
}

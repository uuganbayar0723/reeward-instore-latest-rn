import AppText from '@components/AppText';
import {useAppSelector} from '@store/index';
import {View} from 'react-native';

export default function Basket() {
  const basket = useAppSelector(state => state.basket);

  return (
    <View className="bg-white px-screenPadding flex-1">
      <AppText>Basket</AppText>
    </View>
  );
}

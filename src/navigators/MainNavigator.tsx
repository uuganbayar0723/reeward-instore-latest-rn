import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ProductDetail from '@screens/ProductDetail';
import Basket from '@screens/Basket';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import CloseIcon from '@assets/icons/close.png';
import Payment from '@screens/Payment';
import OrderDetail from '@screens/OrderDetail';

export type MainStackParamList = {
  MainTab: undefined;
  OrderDetail: {orderId: string};
  ProductDetail: {id: string};
  Payment: undefined | {orderId: string};
  Basket: undefined;
};

// export type HasParamsScreen = NativeStackScreenProps<
//   MainStackParamList,
//   'ProductDetail'
// >;

export type RootStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

const MainStack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerRight: HeaderRight,
        headerLeft: () => <View></View>,
      }}>
      <MainStack.Screen
        options={{headerShown: false}}
        name="MainTab"
        component={MainTabNavigator}
      />
      <MainStack.Screen
        options={{
          title: 'Foods',
        }}
        name="ProductDetail"
        component={ProductDetail}
      />
      <MainStack.Screen
        options={{
          title: 'Payment',
          headerShown: false,
        }}
        name="Payment"
        component={Payment}
      />
      <MainStack.Screen
        options={{
          title: 'Basket',
        }}
        name="Basket"
        component={Basket}
      />
      <MainStack.Screen
        options={{
          title: 'OrderDetail',
          headerShown: false,
        }}
        name="OrderDetail"
        component={OrderDetail}
      />
    </MainStack.Navigator>
  );
}

function HeaderRight() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity className="p-3" onPress={() => navigation.goBack()}>
      <FastImage className="w-4 h-4" source={CloseIcon} />
    </TouchableOpacity>
  );
}

export function useMainNavigation() {
  return useNavigation<NativeStackNavigationProp<MainStackParamList>>();
}

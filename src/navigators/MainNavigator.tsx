import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ProductDetail from '@screens/ProductDetail';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppText from '@components/AppText';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import CloseIcon from '@assets/icons/close.png';

export type MainStackParamList = {
  MainTab: undefined;
  ProductDetail: {id: string};
};

export type HasParamsScreen = NativeStackScreenProps<
  MainStackParamList,
  'ProductDetail'
>;

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
    </MainStack.Navigator>
  );
}

function HeaderRight() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity className="" onPress={() => navigation.goBack()}>
      <FastImage className="w-5 h-5" source={CloseIcon} />
    </TouchableOpacity>
  );
}

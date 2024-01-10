import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ProductDetail from '@screens/ProductDetail';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

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
    <MainStack.Navigator>
      <MainStack.Screen
        options={{headerShown: false}}
        name="MainTab"
        component={MainTabNavigator}
      />
      <MainStack.Screen name="ProductDetail" component={ProductDetail} />
    </MainStack.Navigator>
  );
}

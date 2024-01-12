import colors from '@constants/colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '@screens/Home';
import NewSale from '@screens/NewSale';
import Orders from '@screens/Orders';
import Settings from '@screens/Settings';

import ScanIcon from '@assets/icons/scan.png';
import ScanIconActive from '@assets/icons/scanActive.png';
import NewSaleIcon from '@assets/icons/verify.png';
import NewSaleIconActive from '@assets/icons/verifyActive.png';
import OrdersIcon from '@assets/icons/order.png';
import OrdersIconActive from '@assets/icons/orderActive.png';
import SettingsIcon from '@assets/icons/settings.png';
import SettingsIconActive from '@assets/icons/settingsActive.png';
import FastImage from 'react-native-fast-image';

type MainTabParamList = {
  Home: undefined;
  NewSale: undefined;
  Orders: undefined;
  Notification: undefined;
  Settings: undefined;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator(): React.JSX.Element {
  return (
    <MainTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => {
          return (
            <FastImage
              className="w-5 h-5"
              source={iconSelector(route.name, focused)}
            />
          );
        },
      })}>
      <MainTab.Screen name="Home" component={Home} />
      <MainTab.Screen name="NewSale" component={NewSale} />
      <MainTab.Screen name="Orders" component={Orders} />
      {/* <MainTab.Screen name="Notification" component={Notification} /> */}
      <MainTab.Screen name="Settings" component={Settings} />
    </MainTab.Navigator>
  );
}

function iconSelector(routeName: string, isFocused: boolean) {
  switch (routeName) {
    case 'Home':
      return isFocused ? ScanIconActive : ScanIcon;
    case 'NewSale':
      return isFocused ? NewSaleIconActive : NewSaleIcon;
    case 'Orders':
      return isFocused ? OrdersIconActive : OrdersIcon;
    case 'Settings':
      return isFocused ? SettingsIconActive : SettingsIcon;
  }
}

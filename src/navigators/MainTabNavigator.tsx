import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@screens/Home";
import NewSale from "@screens/NewSale";
import Orders from "@screens/Orders";
import Settings from "@screens/Settings";

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
      screenOptions={{
        headerShown: false,
      }}>
      <MainTab.Screen name="Home" component={Home} />
      <MainTab.Screen name="NewSale" component={NewSale} />
      <MainTab.Screen name="Orders" component={Orders} />
      {/* <MainTab.Screen name="Notification" component={Notification} /> */}
      <MainTab.Screen name="Settings" component={Settings} />
    </MainTab.Navigator>
  );
}

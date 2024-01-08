/// <reference types="nativewind/types" />
type MainTabParamList = {
  Home: undefined;
  NewSale: undefined;
  Orders: undefined;
  Notification: undefined;
  Settings: undefined;
};

type AuthStackParamList = {
  Login: undefined;
};

namespace ReactNavigation {
  interface RootParamList extends RootStackParamList {}
}

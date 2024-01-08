/// <reference types="nativewind/types" />
type RootStackParamList = {
  Home: undefined;
};

type AuthStackParamList = {
  Login: undefined;
};

namespace ReactNavigation {
  interface RootParamList extends RootStackParamList {}
}

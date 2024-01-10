import AppText from '@components/AppText';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {HasParamsScreen} from '@navigators/MainNavigator';
import {useGetMenuQuery} from '@store/services/api';
import {useAppSelector} from '@store/index';
import LoadingView from '@components/LoadingView';

export default function ProductDetail({
  route,
}: HasParamsScreen): React.JSX.Element {
  let user = useAppSelector(state => state.user.userState);
  const [product, setProduct] = useState<any>(null);
  const {id} = route.params;

  let {
    data: menu,
    isLoading,
    isSuccess,
  } = useGetMenuQuery({
    outletId: user?.outletId,
  });

  useEffect(() => {
    if (menu) {
      setProduct(menu.allProductsHash[id]);
    }
  }, [menu]);

  if (isLoading || !isSuccess || product === null) {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

  return (
    <View>
      <AppText>{product.name}</AppText>
    </View>
  );
}

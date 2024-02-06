import {NavigationContainer} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@store/index';
import {setAuth} from '@store/slices/auth';

import {StorageKeys, storeGetItem, storeGetObj} from '@utils/asyncStorage';
import {setUser} from '@store/slices/user';
import {useEffect} from 'react';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import {setBasket} from '@store/slices/basket';

export default function AppNavigator(): React.JSX.Element {
  const auth = useAppSelector(state => state.auth.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const authStorage = await storeGetObj(StorageKeys.AUTH);
    if (authStorage) {
      dispatch(setAuth(authStorage));
    }

    const basketStorage = await storeGetObj(StorageKeys.BASKET_LIST);
    if (basketStorage) {
      dispatch(setBasket({basketList: basketStorage}));
    }
  }

  return (
    <NavigationContainer>
      {auth ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

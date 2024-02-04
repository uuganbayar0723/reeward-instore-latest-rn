import {NavigationContainer} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@store/index';
import {setToken} from '@store/slices/auth';

import {StorageKeys, storeGetItem, storeGetObj} from '@utils/asyncStorage';
import {setUser} from '@store/slices/user';
import {useEffect} from 'react';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import {setBasket} from '@store/slices/basket';

export default function AppNavigator(): React.JSX.Element {
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const tokenStorage = await storeGetItem(StorageKeys.TOKEN);
    if (tokenStorage) {
      dispatch(setToken(tokenStorage));
    }
    const userStorage = await storeGetObj(StorageKeys.USER);

    if (tokenStorage) {
      dispatch(setUser(userStorage));
    }

    const basketStorage = await storeGetObj(StorageKeys.BASKET_LIST);
    if (basketStorage) {
      dispatch(setBasket({basketList: basketStorage}));
      // setBasket; console.log({basketStorage});
    }
  }

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

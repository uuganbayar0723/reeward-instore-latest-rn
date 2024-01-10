import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';

import {store} from '@store/index';

import {Provider} from 'react-redux';
import {toastConfig} from './configs/toastConfig';
import AppNavigator from './navigators/AppNavigator';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast config={toastConfig} topOffset={10} visibilityTime={2000} />
    </Provider>
  );
}

export default App;

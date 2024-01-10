import AppText from '@components/AppText';
import React from 'react';
import {View} from 'react-native';
import {HasParamsScreen} from '@navigators/MainNavigator';

export default function ProductDetail({
  route,
}: HasParamsScreen): React.JSX.Element {
  console.log({route});

  return (
    <View>
      <AppText>pr</AppText>
    </View>
  );
}

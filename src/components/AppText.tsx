import React from 'react';
import {View, Text, TextProps} from 'react-native';

interface AppTextProps extends TextProps {}

function AppText({...props}: AppTextProps): React.JSX.Element {
  return (
    // <View className={containerClassName}>
    <Text {...props} className={`text-black ${props.className}`} />
    // </View>
  );
}

export default AppText;

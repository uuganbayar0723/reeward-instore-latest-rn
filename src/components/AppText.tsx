import React from 'react';
import {View, Text, TextProps} from 'react-native';

interface AppTextProps extends TextProps {
  containerClassName?: string;
  className?: string;
}

function AppText({
  containerClassName,
  className,
  ...props
}: AppTextProps): React.JSX.Element {
  return (
    // <View className={containerClassName}>
    <Text {...props} />
    // </View>
  );
}

export default AppText;

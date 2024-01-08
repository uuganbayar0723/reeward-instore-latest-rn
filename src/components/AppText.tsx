import React from 'react';
import {View, Text, TextProps} from 'react-native';

interface AppTextProps extends TextProps {
  text: string;
  containerClassName?: string;
  className?: string;
}

function AppText({
  text,
  containerClassName,
  className,
  ...prop
}: AppTextProps): React.JSX.Element {
  return (
    <View className={containerClassName}>
      <Text {...prop}>{text}</Text>
    </View>
  );
}

export default AppText;

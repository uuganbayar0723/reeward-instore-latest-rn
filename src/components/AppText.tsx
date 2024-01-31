import React from 'react';
import {View, Text, TextProps} from 'react-native';

interface AppTextProps extends TextProps {
  textSize?: TextSizes;
}

export enum TextSizes {
  Small = 12,
  Medium = 14,
  Large = 16,
}

function AppText({textSize, ...props}: AppTextProps): React.JSX.Element {
  return (
    <Text
      className={`text-black ${props.className}`}
      {...props}
      // style={{fontSize: textSize || TextSizes.Medium}}
    />
  );
}

export default AppText;

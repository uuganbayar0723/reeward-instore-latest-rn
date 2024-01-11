import React from 'react';
import {ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface AppLinearProps extends ViewProps {
  color?: string;
}

export default function AppLinear({
  children,
  color,
  ...props
}: AppLinearProps) {
  return (
    <LinearGradient
      {...props}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={
        color ? [color, color] : ['#FD6A6A', '#ED4892']
      }>
      {children}
    </LinearGradient>
  );
}

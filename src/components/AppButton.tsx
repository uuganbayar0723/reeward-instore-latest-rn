import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '@components/AppText';

export enum ButtonHeights {
  Small = 40,
  Medium = 50,
}

interface AppButtonProps extends TouchableOpacityProps {
  text: string;
  containerStyle?: string;
  buttonHeight?: ButtonHeights;
  isDisabled?: boolean;
}

function AppButton({
  text,
  containerStyle,
  isDisabled,
  buttonHeight,
  ...props
}: AppButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity activeOpacity={0.6} {...props}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          height: buttonHeight || ButtonHeights.Medium,
        }}
        className={`${
          isDisabled && 'opacity-60'
        } px-4 rounded-md justify-center items-center `}
        // colors={isDisabled ? ['#F3F3F3', '#F3F3F3'] : ['#FD6A6A', '#ED4892']}
        colors={['#FD6A6A', '#ED4892']}>
        <AppText className="text-white text-[16px] text-center font-bold">
          {text}
        </AppText>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default AppButton;

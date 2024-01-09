import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '@components/AppText';

interface AppButtonProps extends TouchableOpacityProps {
  text: string;
  containerStyle?: string;
  isDisabled?: boolean;
}

function AppButton({
  text,
  containerStyle,
  isDisabled,
  ...props
}: AppButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity activeOpacity={0.6} className={``} {...props}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        className={`${
          isDisabled && 'opacity-60'
        } h-10 px-4 rounded-md justify-center items-center ${props.className}`}
        // colors={isDisabled ? ['#F3F3F3', '#F3F3F3'] : ['#FD6A6A', '#ED4892']}
        colors={['#FD6A6A', '#ED4892']}>
        <AppText text={text} className="text-white text-center font-bold" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default AppButton;

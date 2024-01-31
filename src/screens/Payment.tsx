import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import React from 'react';
import {View, Button, Text, TouchableOpacity, ScrollView} from 'react-native';

function Payment(): React.JSX.Element {
  return (
    <View className="bg-bgGray">
      <ScrollView className="px-screenPadding pt-screenTop ">
        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            <AppText className="text-[24px] font-bold">Pay $18.82</AppText>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="w-8 h-8 bg-white"></TouchableOpacity>
            <TouchableOpacity className="w-8 h-8 ml-4 bg-white"></TouchableOpacity>
          </View>
        </View>
        <View className="mt-5 flex-row">
          <View className="flex-1">
            <AppText>Balance due:</AppText>
            <View className="rounded-lg mt-2 bg-inputGray p-4">
              <AppText className="font-bold text-[24px]">$2.01</AppText>
            </View>
          </View>
          <View className="flex-1 ml-5">
            <AppText>Change:</AppText>
            <View className="rounded-lg mt-2 bg-[#EFEFEF] p-4">
              <AppText className="font-bold text-[24px]">$0.00</AppText>
            </View>
          </View>
        </View>
        <View className="mt-4">
          {keyboardCharacters.map((row: any, index: number) => (
            <View
              key={index}
              className="flex-row mt-4 space-x-4  justify-between">
              {row.map((char: string, indexChar: number) => (
                <TouchableOpacity
                  key={indexChar}
                  className="bg-white rounded-lg flex-1 h-20 justify-center items-center">
                  <AppText className="text-[24px] font-medium">{char}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 space-x-4 ">
          {actionButtons.map((button: string, index: number) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-xl px-4 py-3">
              <AppText className="font-bold text-textDarkerGray text-[16px]">
                {button}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className='mt-4 mb-10'>
          <AppButton text="Pay" />
        </View>
      </ScrollView>
    </View>
  );
}

const keyboardCharacters = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'x'],
];

const actionButtons = ['Voucher', 'Point', 'Store Credit', 'Cash', 'Card'];

export default Payment;

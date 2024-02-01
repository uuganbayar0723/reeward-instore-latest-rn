import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import React, {useEffect} from 'react';
import {View, Button, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useState} from 'react';
import {RootStackScreenProps} from '@navigators/MainNavigator';
import {useAppSelector} from '@store/index';
import {calcProductTotalPrice} from '@utils/helpers';

function Payment({route}: RootStackScreenProps<'Payment'>): React.JSX.Element {
  const [amountInput, setAmountInput] = useState<string>('0');
  const [payAmount, setPayAmount] = useState<number>(0);
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;

  useEffect(() => {
    if (route.params?.orderId) {
    } else {
      let totalPriceSum: number = basketList.reduce(
        (result: number, current: any) =>
          result + calcProductTotalPrice(current),
        0,
      );

      setPayAmount(totalPriceSum);
      setAmountInput(totalPriceSum.toString());
    }
  }, [route]);

  function changeAmount(char: string) {
    if (char === '.' && amountInput.includes('.')) {
      return;
    }

    if (char === 'C') {
      setAmountInput('0');
      return;
    }

    if (amountInput === '0') {
      setAmountInput(char);
      return;
    }

    setAmountInput(prev => prev + char);
  }

  const changeVal: number = payAmount - parseFloat(amountInput);
  const changeField: string = changeVal < 0 ? (-changeVal).toFixed(2) : '0';

  return (
    <View className="bg-bgGray flex-1">
      <ScrollView className="px-screenPadding pt-screenTop ">
        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            <AppText className="text-[24px] font-bold">
              Pay ${payAmount}
            </AppText>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="w-8 rounded-full h-8 bg-white"></TouchableOpacity>
            <TouchableOpacity className="w-8 rounded-full h-8 ml-4 bg-white"></TouchableOpacity>
          </View>
        </View>
        <View className="mt-5 flex-row">
          <View className="flex-1">
            <AppText>Amount</AppText>
            <View className="rounded-lg mt-2 bg-inputGray p-4">
              <AppText numberOfLines={1} className="font-bold text-[24px]">
                ${amountInput}
              </AppText>
            </View>
          </View>
          <View className="flex-1 ml-5">
            <AppText>Change:</AppText>
            <View className="rounded-lg mt-2 bg-[#EFEFEF] p-4">
              <AppText numberOfLines={1} className="font-bold text-[24px]">
                ${changeField}
              </AppText>
            </View>
          </View>
        </View>
        <View className="mt-4">
          {keyboardCharacters.map((row: any, index: number) => (
            <View key={index} className="flex-row mt-4 justify-between">
              {row.map((char: string, indexChar: number) => (
                <KeyBoardItem
                  changeAmount={changeAmount}
                  key={indexChar}
                  char={char}
                />
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
      </ScrollView>
    </View>
  );
}

function KeyBoardItem({char, changeAmount}: any) {
  return (
    <TouchableOpacity
      onPress={() => changeAmount(char)}
      style={{
        marginHorizontal: ['2', '5', '8', '0'].includes(char) ? 20 : 0,
      }}
      className="bg-white rounded-lg flex-1 h-20 justify-center items-center">
      <AppText className="text-[32px] font-medium">{char}</AppText>
    </TouchableOpacity>
  );
}

const keyboardCharacters = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'C'],
];

const actionButtons = ['Card', 'Store credit', 'Point', 'Voucher', 'Cash'];

export default Payment;

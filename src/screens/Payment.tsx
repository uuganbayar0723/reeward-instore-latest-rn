import AppButton from '@components/AppButton';
import AppText from '@components/AppText';
import React, {useEffect, useRef} from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {useState} from 'react';
import {RootStackScreenProps} from '@navigators/MainNavigator';
import {useAppDispatch, useAppSelector} from '@store/index';
import {calcBasketTotalPriceSum, prepareBasketReqFormat} from '@utils/helpers';
import {useGetMeQuery, useMakeOrderMutation} from '@store/services/api';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {setBasket} from '@store/slices/basket';
import AppModal from '@components/AppModal';
import {StorageKeys, storeGetObj, storeSetObj} from '@utils/asyncStorage';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Payment({route}: RootStackScreenProps<'Payment'>): React.JSX.Element {
  const [amountInput, setAmountInput] = useState<string>('0');
  const [payAmount, setPayAmount] = useState<number>(0);
  // const [order, setOrder] = useState<any>(null);
  const basket = useAppSelector(state => state.basket);
  const {basketList} = basket;
  const dispatch = useAppDispatch();
  const {data: meRes, isSuccess: meResIsSuccess} = useGetMeQuery(null);

  useEffect(() => {
    if (route.params?.orderId) {
    } else {
      let totalPriceSum: number = calcBasketTotalPriceSum(basketList);

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

    if (amountInput === '0' && char !== '.') {
      setAmountInput(char);
      return;
    }

    if (amountInput.includes('.')) {
      const afterDecimalLength = amountInput.split('.')[1].length;
      if (afterDecimalLength == 2) {
        return;
      }
    }

    setAmountInput(prev => prev + char);
  }

  // const [makeOrder, orderResponse] = useMakeOrderMutation();
  let orderRef = useRef<any>(null);

  async function handlePayButton(buttonVal: string) {
    // const reqBasket = prepareBasketReqFormat(basketList);

    if (!orderRef.current) {
      const newOrder = await makeOrderLocal({
        basketList,
        payAmount,
        discountList: [],
      });
      orderRef.current = newOrder;
    }

    switch (buttonVal) {
      case ActionButtons.T05:
        t05payment();
        break;
    }
  }

  // useEffect(() => {
  //   if (orderResponse && orderResponse.isSuccess) {
  //     setOrder(orderResponse.data.data);
  //   }
  // }, [orderResponse]);

  // useEffect(() => {
  //   t05payment();
  // }, [order]);

  function t05payment() {
    if (orderRef.current && meRes && meResIsSuccess) {
      if (meRes.outlet.t05.terminalIP) {
        const ws = new WebSocket(`ws://${meRes.outlet.t05.terminalIP}:8888`);
        const paymentId = moment.now();

        Toast.show({
          type: 'info',
          text1: 'Connecting to T05',
        });

        ws.onopen = () => {
          const data = {
            customOrderId: paymentId,
            customPrintData: 'Rewardly Order',
            total: (parseFloat(amountInput) * 100).toFixed(2),
          };
          const jsonData = JSON.stringify(data);
          ws.send(jsonData);
        };
        ws.onmessage = async event => {
          const message = JSON.parse(event.data);

          if (message && message.status === 'Approved') {
            const {amountInCents, date, customOrderId} = message;
            const displayVal = (amountInCents / 100).toFixed(2);
            Toast.show({
              type: 'success',
              text1: `$${displayVal} paid`,
            });

            const {payments, id: orderId} = orderRef.current;
            const paidAmount = parseFloat((amountInCents / 100).toFixed(2));

            orderRef.current = {
              ...orderRef.current,
              payments: [
                ...payments,
                {
                  date,
                  amount: paidAmount,
                  type: 'Card T05',
                  id: customOrderId,
                },
              ],
            };

            await storeSetObj({
              key: StorageKeys.ORDER,
              value: orderRef.current,
              additional: orderId,
            });
            const orderStorage = await storeGetObj(StorageKeys.ORDER, orderId);

            setPayAmount(prev => prev - paidAmount);
            dispatch(setBasket({basketList: []}));

            // const inputValue = parseFloat(amountInput);
            // const newValue = payAmount - inputValue;

            // setAmountInput('0');
            // setPayAmount(0);
          } else {
            Toast.show({
              type: 'error',
              text1: message.status,
            });
          }
        };
        ws.onerror = error => {
          if (error) {
            // Toast.show({type: 'error', text1: 'Connection error'});
          }
        };
      }
    }
  }

  const changeVal: number = payAmount - parseFloat(amountInput);
  const changeField: string = changeVal < 0 ? (-changeVal).toFixed(2) : '0';

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  return (
    <View className="bg-bgGray flex-1">
      <AppModal
        modalVisible={isPaymentModalVisible}
        setModalVisible={setIsPaymentModalVisible}>
        <View className="justify-center h-[300px] items-center flex-1">
          <AppText className="text-xl font-bold text-[#019C93]">
            Payment successful
          </AppText>
        </View>
      </AppModal>
      <ScrollView className="px-screenPadding pt-screenTop ">
        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            <AppText className="text-[24px] font-bold">
              Pay ${payAmount}
            </AppText>
          </View>
          {/* <View className="flex-row">
            <TouchableOpacity className="w-8 rounded-full h-8 bg-white"></TouchableOpacity>
            <TouchableOpacity className="w-8 rounded-full h-8 ml-4 bg-white"></TouchableOpacity>
          </View> */}
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
          {actionButtons.map((button: any, index: number) => (
            <TouchableOpacity
              onPress={() => handlePayButton(button.value)}
              key={index}
              className="bg-white rounded-xl px-4 py-3">
              <AppText className="font-bold text-textDarkerGray text-[16px]">
                {button.name}
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

// const actionButtons = ['Card', 'Store credit', 'Point', 'Voucher', 'Cash'];
enum ActionButtons {
  T05 = 't05',
}
const actionButtons = [{name: 'Card (T05)', value: ActionButtons.T05}];

async function makeOrderLocal({basketList, payAmount, discountList}: any) {
  const timeNow = moment.now();
  const dateNow = moment().format('YYYY-MM-DD');

  const orderValue = {
    basketList,
    discountList,
    created_at: timeNow,
    payments: [],
    payAmount,
    id: timeNow,
  };

  let orderListIds = [`${StorageKeys.ORDER}-${timeNow}`];
  const orderListSpecificDay = await storeGetObj(
    StorageKeys.ORDER_LIST,
    dateNow,
  );

  if (orderListSpecificDay) {
    orderListIds = orderListIds.concat(orderListSpecificDay);
  }

  await storeSetObj({
    key: StorageKeys.ORDER_LIST,
    value: orderListIds,
    additional: dateNow,
  });

  await storeSetObj({
    key: StorageKeys.ORDER,
    value: orderValue,
    additional: timeNow,
  });

  return orderValue;
}

export default Payment;

import AsyncStorage from '@react-native-async-storage/async-storage';
// import { UserInterface } from '@store/slices/user';

export enum StorageKeys {
  AUTH = 'auth',
  USER = 'user',
  HOST = 'host',
  BASKET_LIST = 'basket',
  ORDER = 'order',
  ORDER_LIST = 'orderList',
}

interface StoreItemInterface {
  key: StorageKeys;
  value: string;
}

interface StoreObjInterface {
  key: StorageKeys;
  value: any;
  additional?: number | string;
}

export const storeSetItem = async ({key, value}: StoreItemInterface) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};

export const storeSetObj = async ({
  key,
  value,
  additional,
}: StoreObjInterface) => {
  try {
    let keyLocal: string = key;
    if (additional) {
      if (key === StorageKeys.ORDER) {
        keyLocal = `${StorageKeys.ORDER}-${additional}`;
      }
      if (key === StorageKeys.ORDER_LIST) {
        keyLocal = `${StorageKeys.ORDER_LIST}-${additional}`;
      }
    }

    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(keyLocal, jsonValue);
  } catch (e) {}
};

export const storeGetItem = async (key: StorageKeys) => {
  try {
    let value = await AsyncStorage.getItem(key);
    return value || null;
  } catch (e) {}
};

export const storeGetObj = async (key: StorageKeys, additional?: string) => {
  try {
    let keyLocal: string = key;
    if (additional) {
      if (key === StorageKeys.ORDER_LIST) {
        keyLocal = `${StorageKeys.ORDER_LIST}-${additional}`;
      }

      if (key === StorageKeys.ORDER) {
        keyLocal = `${StorageKeys.ORDER}-${additional}`;
      }
    }

    const jsonValue = await AsyncStorage.getItem(keyLocal);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const storeRemoveItem = async (key: StorageKeys) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};

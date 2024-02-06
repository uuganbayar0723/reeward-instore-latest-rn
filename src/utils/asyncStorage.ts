import AsyncStorage from '@react-native-async-storage/async-storage';
// import { UserInterface } from '@store/slices/user';

export enum StorageKeys {
    AUTH = 'auth',
    USER = 'user',
    HOST = 'host',
    BASKET_LIST = 'basket'
}

interface StoreItemInterface {
  key: StorageKeys;
  value: string;
}

interface StoreObjInterface {
  key: StorageKeys;
  value: any;
}

export const storeSetItem = async ({key, value}: StoreItemInterface) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};

export const storeSetObj = async ({key, value}: StoreObjInterface) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {}
};

export const storeGetItem = async (key: StorageKeys) => {
  try {
    let value = await AsyncStorage.getItem(key);
    return value || null;
  } catch (e) {}
};

export const storeGetObj = async (key: StorageKeys) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const storeRemoveItem = async (key: StorageKeys) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};

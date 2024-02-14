import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {compareObjects} from '@utils/utils';
import {StorageKeys, storeRemoveItem, storeSetObj} from '@utils/asyncStorage';

export interface BasketInterface {
  basketList: any;
}

const initialState: BasketInterface = {basketList: []};

const basketSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBasket: (
      state: BasketInterface,
      action: PayloadAction<BasketInterface>,
    ) => {
      // only use on app init
      state.basketList = action.payload.basketList;
    },
    clearBasket: (state: BasketInterface) => {
      state.basketList = [];
      storeSetObj({key: StorageKeys.BASKET_LIST, value: []});
    },
    addToBasket: (state: BasketInterface, action: PayloadAction<any>) => {
      const {payload} = action;

      const hasSameProduct = state.basketList.filter((product: any) =>
        // assign same quantity to compare objects
        compareObjects({...product, quantity: payload.quantity}, payload),
      ).length;
      if (hasSameProduct) {
        state.basketList = state.basketList.map((product: any) => ({
          ...product,
          quantity: compareObjects(
            {...product, quantity: payload.quantity},
            payload,
          )
            ? product.quantity + 1
            : product.quantity,
        }));

        storeSetObj({key: StorageKeys.BASKET_LIST, value: state.basketList});
        return;
      }
      
      state.basketList.push({...payload, quantity: payload.quantity + 1});
      storeSetObj({key: StorageKeys.BASKET_LIST, value: state.basketList});
    },
    removeFromBasket: (state: BasketInterface, action: PayloadAction<any>) => {
      const {payload} = action;

      state.basketList = state.basketList.filter(
        (product: any) => !compareObjects(product, payload),
      );

      storeSetObj({key: StorageKeys.BASKET_LIST, value: state.basketList});
    },
    changeBasketItemQuantity: (
      state: BasketInterface,
      action: PayloadAction<any>,
    ) => {
      const {product: selectedProduct, changeVal} = action.payload;

      const updatedList = state.basketList.map((product: any) => {
        if (compareObjects(product, selectedProduct)) {
          return {
            ...product,
            quantity: product.quantity + changeVal,
          };
        }
        return product;
      });

      state.basketList = updatedList.filter((product: any) => product.quantity);
      storeSetObj({key: StorageKeys.BASKET_LIST, value: state.basketList});
    },
  },
});

export const {
  setBasket,
  clearBasket,
  addToBasket,
  removeFromBasket,
  changeBasketItemQuantity,
} = basketSlice.actions;
export default basketSlice.reducer;

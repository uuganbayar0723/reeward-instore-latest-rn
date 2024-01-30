import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {compareObjects} from '@utils/utils';

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
      state.basketList = action.payload.basketList;
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

        return;
      }

      state.basketList.push({...payload, quantity: payload.quantity + 1});
    },
    removeFromBasket: (state: BasketInterface, action: PayloadAction<any>) => {
      const {payload} = action;

      state.basketList = state.basketList.filter(
        (product: any) => !compareObjects(product, payload),
      );
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
    },
  },
});

export const {setBasket, addToBasket, removeFromBasket, changeBasketItemQuantity} =
  basketSlice.actions;
export default basketSlice.reducer;

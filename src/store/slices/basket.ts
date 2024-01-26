import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

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

      const hasSameProduct = state.basketList.filter(
        (product: any) => product.id === payload.id,
      ).length;
      if (hasSameProduct) {
        state.basketList = state.basketList.map((product: any) => ({
          ...product,
          quantity:
            product.id === payload.id ? product.quantity + 1 : product.quantity,
        }));

        return;
      }

      state.basketList.push({...payload, quantity: payload.quantity + 1});
    },
  },
});

export const {setBasket, addToBasket} = basketSlice.actions;
export default basketSlice.reducer;

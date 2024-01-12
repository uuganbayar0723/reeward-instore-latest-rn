import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface BasketInterface {
  basketList: any;
  total: number;
}

const initialState: BasketInterface = {basketList: [], total: 0};

const basketSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBasket: (
      state: BasketInterface,
      action: PayloadAction<BasketInterface>,
    ) => {
      state.basketList = action.payload.basketList;
      state.total = action.payload.total;
    },
    addToBasket: (state: BasketInterface, action: PayloadAction<any>) => {
      state.basketList.push(action.payload);
    },
  },
});

export const {setBasket, addToBasket} = basketSlice.actions;
export default basketSlice.reducer;

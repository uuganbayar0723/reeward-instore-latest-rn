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
      state.basketList.push(action.payload);
    },
  },
});

export const {setBasket, addToBasket} = basketSlice.actions;
export default basketSlice.reducer;

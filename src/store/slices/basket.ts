import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface BasketInterface {
  basketList: [];
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
  },
});

export const {setBasket} = basketSlice.actions;
export default basketSlice.reducer;

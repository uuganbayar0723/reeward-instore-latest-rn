import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface BasketInterface {
  basketList: [];
  total: number;
}

const initialState: BasketInterface | null = null;

const basketSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBasket: (
      state: BasketInterface | null,
      action: PayloadAction<BasketInterface>,
    ) => {
      if (state !== null) {
        state.basketList = action.payload.basketList;
      }
    },
  },
});

export const {setBasket} = basketSlice.actions;
export default basketSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: any = {
  data: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const {setAuth} = authSlice.actions;
export default authSlice.reducer;

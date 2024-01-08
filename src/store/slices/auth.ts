import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AuthInterface {
  token: string;
}

const initialState: AuthInterface = {
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const {setToken} = authSlice.actions;
export default authSlice.reducer;
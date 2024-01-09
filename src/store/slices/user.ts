import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface Merchant {
  id: string;
  name: string;
}

export interface UserInterface {
  //   email: string;
  //   firstname: string;
  //   lastname: string;
  //   name: string;
  //   role: string;
  //   language: string;
  //   merchant: Merchant;
  outletId: string;
}

interface InitUser {
  userState: UserInterface | null;
}

const initialState: InitUser = {
  userState: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInterface>) => {
      state.userState = action.payload;
    },
  },
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;

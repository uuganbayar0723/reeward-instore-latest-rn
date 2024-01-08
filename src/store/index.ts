import {configureStore} from '@reduxjs/toolkit';
import auth from './slices/auth';
import user from './slices/user';

import {apiSlice} from './services/api';

export const store = configureStore({
  reducer: {
    auth,
    user,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;



import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
// import type { RootState, AppDispatch } from '../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
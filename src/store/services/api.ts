import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '..';

interface LoginBody {
  email: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.reeward.app/api',
    prepareHeaders: (headers, {getState}) => {
      const {token} = (getState() as RootState).auth;
      headers.set('authorization', token ? `Bearer ${token}` : '');
      return headers;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: (body: LoginBody) => ({
        url: '/users/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getMenu: builder.query({
      query: params => ({
        url: `https://order.reeward.app/api/menu`,
        params,
      }),
      transformResponse: (res: {data: any}) => res.data
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation, useGetMenuQuery} = apiSlice;

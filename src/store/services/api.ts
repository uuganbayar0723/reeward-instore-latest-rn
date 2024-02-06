import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '..';
import {formatMenu, generalFormat} from '@utils/formatResponse';

interface LoginBody {
  email: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.reeward.app/api',
    prepareHeaders: (headers, {getState}) => {
      const auth = (getState() as RootState).auth;
      let token = '';
      if (auth) {
        token = auth.token;
      }
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
    getMe: builder.query({
      query: () => ({
        url: `/users/me`,
      }),
      transformResponse: generalFormat,
    }),
    getMenu: builder.query({
      query: params => ({
        url: `https://order.reeward.app/api/menu`,
        params,
      }),
      transformResponse: formatMenu,
    }),
    makeOrder: builder.mutation({
      query: (body: LoginBody) => ({
        url: 'https://order.reeward.app/api/v2/storeapp/orders/checkout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation, useGetMenuQuery, useGetMeQuery} = apiSlice;

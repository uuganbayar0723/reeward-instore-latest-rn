import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '..';
import {formatMenu, generalFormat} from '@utils/formatResponse';
import moment from 'moment';

interface LoginBody {
  email: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.reeward.app/api',
    prepareHeaders: (headers, {getState}) => {
      const auth = (getState() as RootState).auth.data;
      let token = '';
      let merchantId = '';
      let outletId = '';

      if (auth) {
        const {token: aToken, user} = auth;
        const {merchant, outlet} = user;
        token = aToken;
        merchantId = merchant._id;
        outletId = outlet._id;
      }
      // headers.set('content-Type', 'application/json');
      headers.set('authorization', `Bearer ${token}`);
      headers.set('merchant', merchantId);
      headers.set('outlet', outletId);

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
    getOrders: builder.query({
      query: () => ({
        url: 'https://order.reeward.app/api/orders',
        params: {
          limit: 20,
          filter: JSON.stringify({
            valueFrom: new Date().toISOString(),
            valueTo: moment().endOf('day').toISOString(),
          }),
        },
      }),
      transformResponse: generalFormat,
    }),
    makeOrder: builder.mutation({
      query: body => ({
        url: 'https://order.reeward.app/api/v2/storeapp/orders/checkout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetMenuQuery,
  useGetMeQuery,
  useMakeOrderMutation,
  useGetOrdersQuery,
} = apiSlice;

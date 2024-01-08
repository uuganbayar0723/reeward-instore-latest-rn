import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface LoginBody {
  email: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: 'https://api.reeward.app/api'}),
  endpoints: builder => ({
    login: builder.mutation({
      query: (body: LoginBody) => ({
        url: '/users/auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation} = apiSlice;

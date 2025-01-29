import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export const withdrawalsService = createApi({
  reducerPath: 'withdrawalsService',
  baseQuery: baseQueryWithOnQueryStarted,
  keepUnusedDataFor: 0,
  tagTypes: ['Withdrawals'],
  endpoints: (builder) => ({
    getWithdrawals: builder.query<any, any>({
      query: ({ page = 0, limit = 10, filters = {} }) => {
        return {
          url: '/withdrawals',
          params: { page, limit, filters: JSON.stringify(filters) },
        };
      },
      providesTags: ['Withdrawals'],
    }),
    getTotalWithdrawals: builder.query<any, any>({
      query: ({ userId = '' }) => {
        return {
          url: '/totalWithdrawals',
          params: { userId },
        };
      },
    }),
    registerWithdrawal: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/withdrawal',
          body: requestBody,
          method: 'POST',
        };
      },
      invalidatesTags: ['Withdrawals'],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useGetTotalWithdrawalsQuery,
  useRegisterWithdrawalMutation,
} = withdrawalsService;

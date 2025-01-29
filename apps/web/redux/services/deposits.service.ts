import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export const depositsService = createApi({
  reducerPath: 'depositsService',
  baseQuery: baseQueryWithOnQueryStarted,
  keepUnusedDataFor: 0,
  tagTypes: ['Deposits'],
  endpoints: (builder) => ({
    getDeposits: builder.query<any, any>({
      query: ({ page = 0, limit = 0, filters = {} }) => {
        const params: any = {
          page,
          limit,
          filters: JSON.stringify(filters),
        };

        return {
          url: '/deposits',
          params,
        };
      },
      providesTags: ['Deposits'],
    }),
    depositTransaction: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/deposit-transaction',
          body: requestBody,
          method: 'POST',
        };
      },
    }),
  }),
});

export const { useGetDepositsQuery, useDepositTransactionMutation } =
  depositsService;

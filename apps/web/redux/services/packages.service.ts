import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from '@/redux/services/api.utils';

export const packagesService = createApi({
  reducerPath: 'packagesService',
  baseQuery: baseQueryWithOnQueryStarted,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    buyPackage: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/packages',
          body: requestBody,
          method: 'POST',
        };
      },
    }),
  }),
});

export const { useBuyPackageMutation } = packagesService;

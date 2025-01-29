import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITaxDataGridState {
  page: number;
  limit: number;
  filters: object;
}
const initialState: ITaxDataGridState = {
  page: 0,
  limit: 15,
  filters: {},
};

export const taxDataGridSlice = createSlice({
  name: 'taxDataGrid',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<any>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<any>) {
      state.limit = action.payload;
    },
    setFilters(state, action: PayloadAction<any>) {
      state.filters = action.payload;
    },
  },
});

export const { setPage, setFilters, setLimit } = taxDataGridSlice.actions;

export default taxDataGridSlice.reducer;

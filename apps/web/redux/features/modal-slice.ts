import { ReactNode } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IOpenModalActionProps {
  title: string;
  text?: string;
  onPress?: () => any;
  showCatalogue?: boolean;
  descriptionNode?: ReactNode;
}

export interface IAlertDialogState {
  isOpen: boolean;
  title: string;
  onPress?: any;
  descriptionNode?: ReactNode;
  showCatalogue: boolean;
}

const initialState: IAlertDialogState = {
  isOpen: false,
  title: '',
  showCatalogue: false,
};

export const alertDialogSlice = createSlice({
  name: 'alertDialog',
  initialState,
  reducers: {
    openAlertDialog(state, action: PayloadAction<IOpenModalActionProps>) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.descriptionNode = action.payload.descriptionNode;
      state.onPress = action.payload.onPress;
      state.showCatalogue = action.payload.showCatalogue || false;
    },
    closeAlertDialog(state) {
      state.isOpen = false;
    },
  },
});

export const { openAlertDialog, closeAlertDialog } = alertDialogSlice.actions;

export default alertDialogSlice.reducer;

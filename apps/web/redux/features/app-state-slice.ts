import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaxSeverity } from '@repo/enums';

export interface IAlertPayloadProps {
  title: string;
  text: string;
  severity: TaxSeverity;
}

export interface IAlertState {
  title: string;
  text: string;
  severity: TaxSeverity;
  isOpen: boolean;
}

export interface IAppState {
  title: string;
  selectedBuildingId: string;
  alert: IAlertState;
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    walletPublicKey: string;
    status: string;
  };
}

const initialState: IAppState = {
  title: '',
  selectedBuildingId: '',
  isLoggedIn: false,
  user: {} as any,
  alert: {
    title: '',
    text: '',
    severity: TaxSeverity.Neutral,
    isOpen: false,
  },
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setPageTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setSelectedBuildingId(state, action: PayloadAction<string>) {
      state.selectedBuildingId = action.payload;
    },
    closeAlert(state) {
      state.alert.isOpen = false;
      state.alert.text = '';
      state.alert.title = '';
    },
    setLoggedIn(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setLoggedOut(state, action: PayloadAction<void>) {
      state.isLoggedIn = false;
      state.user = {} as any;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },
});

export const {
  setPageTitle,
  setSelectedBuildingId,
  closeAlert,
  setLoggedIn,
  setLoggedOut,
  setUser,
} = appStateSlice.actions;

export default appStateSlice.reducer;

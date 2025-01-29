import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
// features
import { IThemeState, themeSlice } from './features/theme-slice';
import {
  ITaxDataGridState,
  taxDataGridSlice,
} from './features/tax-data-grid-slice';
import { alertDialogSlice, IAlertDialogState } from './features/modal-slice';
import { appStateSlice, IAppState } from './features/app-state-slice';
// services
import { usersService } from './services/users.service';
import { authService } from './services/auth.service';
import { withdrawalsService } from '@/redux/services/withdrawals.service';
import { depositsService } from '@/redux/services/deposits.service';
import { packagesService } from '@/redux/services/packages.service';

export interface RootState {
  theme: IThemeState;
  taxDataGrid: ITaxDataGridState;
  appState: IAppState;
  alertDialog: IAlertDialogState;
  [authService.reducerPath]: ReturnType<typeof authService.reducer>;
  [usersService.reducerPath]: ReturnType<typeof usersService.reducer>;
  [withdrawalsService.reducerPath]: ReturnType<
    typeof withdrawalsService.reducer
  >;
  [depositsService.reducerPath]: ReturnType<typeof depositsService.reducer>;
  [packagesService.reducerPath]: ReturnType<typeof packagesService.reducer>;
}
const rootReducer = combineReducers({
  // slices
  [themeSlice.name]: themeSlice.reducer,
  [taxDataGridSlice.name]: taxDataGridSlice.reducer,
  [appStateSlice.name]: appStateSlice.reducer,
  [alertDialogSlice.name]: alertDialogSlice.reducer,
  // services
  [authService.reducerPath]: authService.reducer,
  [usersService.reducerPath]: usersService.reducer,
  [depositsService.reducerPath]: depositsService.reducer,
  [packagesService.reducerPath]: packagesService.reducer,
  [withdrawalsService.reducerPath]: withdrawalsService.reducer,
});

const persistConfig = (reducersToPersist: string[]) => ({
  key: 'root',
  storage,
  whitelist: reducersToPersist,
});

const persistRootReducer = persistReducer(
  persistConfig([themeSlice.name, appStateSlice.name]),
  rootReducer,
);

export const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authService.middleware,
      usersService.middleware,
      depositsService.middleware,
      packagesService.middleware,
      withdrawalsService.middleware,
    ]),
});

const persistor = persistStore(store);

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { persistor, useAppSelector };

export default store;

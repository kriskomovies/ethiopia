import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DARK_THEME, LIGHT_THEME } from '@/utils/theme';

export interface IThemeState {
  selectedTheme: string;
  selectedMainColor: string;
}

const initialState: IThemeState = {
  selectedTheme: LIGHT_THEME,
  selectedMainColor: '#9a3131',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.selectedTheme === LIGHT_THEME) {
        state.selectedTheme = DARK_THEME;
      } else {
        state.selectedTheme = LIGHT_THEME;
      }
    },
    changeSelectedMainColor: (state, action: PayloadAction<string>) => {
      state.selectedMainColor = action.payload;
    },
  },
});

export const { toggleTheme, changeSelectedMainColor } = themeSlice.actions;

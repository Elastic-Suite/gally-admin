import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

export interface II18nState {
  language: string
}

const initialState: II18nState = {
  language: 'en',
}

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
    },
  },
})

export const { setLanguage } = i18nSlice.actions
export const i18nReducer = i18nSlice.reducer

export const selectLanguage = (state: RootState): string => state.i18n.language

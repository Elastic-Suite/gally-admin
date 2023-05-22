import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  Bundle,
  IApi,
  IConfigurations,
  IMetadata,
} from '@elastic-suite/gally-admin-shared'

import { RootState } from './store'

export interface IDataState {
  api: IApi
  bundles: Bundle[]
  configurations: IConfigurations
  metadata: IMetadata[]
}

const initialState: IDataState = {
  api: null,
  bundles: null,
  configurations: null,
  metadata: null,
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IDataState>) {
      state.api = action.payload.api
      state.bundles = action.payload.bundles
      state.configurations = action.payload.configurations
      state.metadata = action.payload.metadata
    },
  },
})

export const { setData } = dataSlice.actions
export const dataReducer = dataSlice.reducer

export const selectApi = (state: RootState): IApi => state.data.api
export const selectBundles = (state: RootState): Bundle[] => state.data.bundles
export const selectConfiguration = (state: RootState): IConfigurations =>
  state.data.configurations
export const selectMetadata = (state: RootState): IMetadata[] =>
  state.data.metadata

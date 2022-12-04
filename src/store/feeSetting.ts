import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LocalStorageObjectManager} from '@util/extend/local-stroage';

export interface FeeSettingState {
  droughty: number;
  enableRing: boolean;
  enableValuePackage: boolean;
  eventFee: number;
}

const initialState: FeeSettingState = {
  enableRing: false,
  droughty: 9999,
  eventFee: 0,
  enableValuePackage: true
};

const feeSettingSlice = createSlice({
  name: 'feeSetting',
  initialState,
  reducers: {
    setFeeSettingActionCreator: (state, {payload}: PayloadAction<FeeSettingState>) => {
      MANAGER.setStringifyItem(payload);
      return payload;
    },
    initializeFeeSetting: () => {
      return MANAGER.parseItem() as FeeSettingState;
    },
  },
});

const MANAGER = new LocalStorageObjectManager<FeeSettingState>('fee-setting', initialState);

export const {setFeeSettingActionCreator, initializeFeeSetting} = feeSettingSlice.actions;
export default feeSettingSlice.reducer;

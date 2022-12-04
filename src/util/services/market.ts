import type {FeeSettingState} from '@store/feeSetting';
import {getFee} from '@util/services/fee';
import Decimal from 'decimal.js';

export interface BreakEvenParam {
  buyPrice: number;
  feeSetting: FeeSettingState;
}

export function getBreakEven({buyPrice, feeSetting}: BreakEvenParam) {
  const fee = getFee(feeSetting);
  return new Decimal(buyPrice).div(fee).ceil().toNumber();
}

export interface CapitalGainParam {
  buyPrice: number;
  sellPrice: number;
  standard: number;
  feeSetting: FeeSettingState;
}

export interface NumericInfo {
  value: number;
  state: 'positive' | 'negative';
  stateText: string;
}

export function getCapitalGains({buyPrice, sellPrice, standard, feeSetting}: CapitalGainParam): NumericInfo {
  const fee = getFee(feeSetting);
  const revenue = new Decimal(sellPrice).mul(fee).minus(buyPrice).toNumber();
  const value = new Decimal(revenue).mul(standard).div(buyPrice).floor().toNumber();

  if (revenue > 0) {
    return {
      stateText: '수익이',
      state: 'positive',
      value
    };
  } else {
    return {
      stateText: '손해가',
      state: 'negative',
      value
    };
  }
}

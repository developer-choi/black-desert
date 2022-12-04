import {getFee} from '@util/services/fee';
import Decimal from 'decimal.js';
import type {FeeSettingState} from '@store/feeSetting';

export const GYG_COUNT_BY_1HOUR = 500; //고유결을 1시간동안 500개 깐다고 가정합니다.
export const BLACK_STONE_ARMOR_BY_1HOUR = 375; //1시간동안 나온 사냥꾼의 인장이 약 750개, 이를 블방으로 바꿨을 때 375개라고 가정합니다.

export interface GygRevenueParam {
  gygPrice: number;
  gipaPrice: number;
  blackStoneArmorPrice: number;
  feeSetting: FeeSettingState;
}

export function gygRevenue({gygPrice, gipaPrice, blackStoneArmorPrice, feeSetting}: GygRevenueParam) {
  if ([gygPrice, gipaPrice].includes(0)) {
    return {
      totalRevenue: 0,
      blackStoneArmorRevenue: 0,
      gipaRevenue: 0
    };
  }

  const fee = getFee(feeSetting);
  const totalGipaPrice = gipaPrice * GYG_COUNT_BY_1HOUR;
  const totalGygPrice = gygPrice * GYG_COUNT_BY_1HOUR;
  const totalGipaRevenue = new Decimal(totalGipaPrice).mul(fee).minus(totalGygPrice).floor().toNumber();
  const totalBlackStoneArmorRevenue = new Decimal(blackStoneArmorPrice).mul(BLACK_STONE_ARMOR_BY_1HOUR).mul(fee).floor().toNumber();
  
  return {
    gipaRevenue: totalGipaRevenue,
    blackStoneArmorRevenue: totalBlackStoneArmorRevenue,
    totalRevenue: totalGipaRevenue + totalBlackStoneArmorRevenue
  };
}

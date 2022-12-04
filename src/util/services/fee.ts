import type {FeeSettingState} from '@store/feeSetting';
import Decimal from 'decimal.js';

export function getFee({droughty, enableRing, enableValuePackage, eventFee}: FeeSettingState) {
  const droughtyFee = getDroughtyFee(droughty);
  const valuePackageFee = enableValuePackage ? VALUE_PACKAGE_FEE_LABEL.fee : 0;
  const ringFee = enableRing ? RING_FEE_LABEL.fee : 0;
  const totalFee = new Decimal(1).add(droughtyFee).add(valuePackageFee).add(ringFee).add(eventFee);
  return totalFee.mul(BASIC_FEE).toNumber();
}

interface DroughtyRevenueTable {
  value: number;
  meaning: string;
  fee: number;
}

export const DROUGHTY_FEE_TABLES: DroughtyRevenueTable[] = [
  {
    value: 999,
    meaning: '가문명성 1000 미만',
    fee: 0
  },
  {
    value: 3999,
    meaning: '1000 ~ 3999',
    fee: 0.005
  },
  {
    value: 6999,
    meaning: '4000 ~ 6999',
    fee: 0.01
  },
  {
    value: 9999,
    meaning: '7000 이상',
    fee: 0.015
  }
];

export function getDroughtyFee(droughty: number) {
  const {fee: droughtyFee} = DROUGHTY_FEE_TABLES.find(({value}) => {
    return droughty <= value;
  }) as DroughtyRevenueTable;

  return droughtyFee;
}

export class FeeLabel {
  fee: number;
  percent: number;
  name: string;

  constructor(fee: number, name: string) {
    this.fee = fee;
    this.name = name;
    this.percent = new Decimal(fee).mul(100).toNumber();
  }
}

export const DEFAULT_FEE_LABEL = new FeeLabel(0.3, '거래소 수수료');
export const FIEF_FEE_LABEL = new FeeLabel(0.05, '영지 세금');
export const BASIC_FEE = new Decimal(1).minus(DEFAULT_FEE_LABEL.fee).minus(FIEF_FEE_LABEL.fee).toNumber();

export const VALUE_PACKAGE_FEE_LABEL = new FeeLabel(0.3, '밸류패키지');
export const RING_FEE_LABEL = new FeeLabel(0.05, '거상의반지 or 그믐달 거래 우대권');

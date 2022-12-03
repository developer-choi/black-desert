const BASIC_REVENUE = 0.65;
const VALUE_PACKAGE_BONUS = BASIC_REVENUE * 0.3;
export const GYG_COUNT_BY_1HOUR = 500; //고유결을 1시간동안 500개 깐다고 가정합니다.
export const BLACK_STONE_ARMOR_BY_1HOUR = 375; //1시간동안 나온 사냥꾼의 인장이 약 750개, 이를 블방으로 바꿨을 때 375개라고 가정합니다.

export interface DroughtyRevenueTable {
  value: number;
  meaning: string;
  revenue: number;
}

export const DROUGHTY_REVENUE_TABLES = [
  {
    value: 999,
    meaning: '1000 미만',
    revenue: BASIC_REVENUE + VALUE_PACKAGE_BONUS
  },
  {
    value: 3999,
    meaning: '1000 ~ 3999',
    revenue: BASIC_REVENUE + VALUE_PACKAGE_BONUS + BASIC_REVENUE * 0.005
  },
  {
    value: 6999,
    meaning: '4000 ~ 6999',
    revenue: BASIC_REVENUE + VALUE_PACKAGE_BONUS + BASIC_REVENUE * 0.01
  },
  {
    value: 9999,
    meaning: '7000 이상',
    revenue: BASIC_REVENUE + VALUE_PACKAGE_BONUS + BASIC_REVENUE * 0.015
  }
];

export interface GygRevenueParam {
  gygPrice: number;
  droughty: number;
  gipaPrice: number;
  blackStoneArmorPrice: number;
}

export function gygRevenue({gygPrice, gipaPrice, droughty, blackStoneArmorPrice}: GygRevenueParam) {
  if ([gygPrice, gipaPrice, droughty].includes(0)) {
    return {
      totalRevenue: 0,
      blackStoneArmorRevenue: 0,
      gipaRevenue: 0
    };
  }
  
  const {revenue} = DROUGHTY_REVENUE_TABLES.find(({value}) => {
    return droughty <= value;
  }) as DroughtyRevenueTable;
  
  const totalGipaPrice = gipaPrice * GYG_COUNT_BY_1HOUR;
  const totalGygPrice = gygPrice * GYG_COUNT_BY_1HOUR;
  const totalGipaRevenue = Math.floor(totalGipaPrice * revenue - totalGygPrice);
  const totalBlackStoneArmorRevenue = Math.floor(blackStoneArmorPrice * BLACK_STONE_ARMOR_BY_1HOUR * revenue);
  
  return {
    gipaRevenue: totalGipaRevenue,
    blackStoneArmorRevenue: totalBlackStoneArmorRevenue,
    totalRevenue: totalGipaRevenue + totalBlackStoneArmorRevenue
  };
}

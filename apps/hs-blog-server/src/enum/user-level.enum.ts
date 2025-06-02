export enum UserLevel {
  HY_1 = 'HY.1',
  HY_2 = 'HY.2',
  HY_3 = 'HY.3',
  HY_4 = 'HY.4',
  HY_5 = 'HY.5',
  HY_6 = 'HY.6',
  HY_7 = 'HY.7',
  HY_8 = 'HY.8',
  HY_9 = 'HY.9',
  HY_10 = 'HY.10',
}

export const LEVEL_POINTS = {
  [UserLevel.HY_1]: { min: 0, max: 500 },
  [UserLevel.HY_2]: { min: 501, max: 1000 },
  [UserLevel.HY_3]: { min: 1001, max: 2000 },
  [UserLevel.HY_4]: { min: 2001, max: 3500 },
  [UserLevel.HY_5]: { min: 3501, max: 5000 },
  [UserLevel.HY_6]: { min: 5001, max: 7000 },
  [UserLevel.HY_7]: { min: 7001, max: 9000 },
  [UserLevel.HY_8]: { min: 9001, max: 12000 },
  [UserLevel.HY_9]: { min: 12001, max: 15000 },
  [UserLevel.HY_10]: { min: 15001, max: Infinity },
}; 
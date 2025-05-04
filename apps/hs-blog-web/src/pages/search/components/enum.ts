/*搜索维度枚举*/
export enum SearchDimension {
  /*综合*/
  SYNTHESIS = 0,
  /*文章*/
  ARTICLE = 1,
  /*标签*/
  TAG = 2,
}

/*搜索日期维度枚举*/
export enum Period {
  /*时间不限*/
  NOW = 0,
  /*最近一周*/
  WEEK = 1,
  /*最近一月*/
  MONTH = 2,
  /*最近一年*/
  YEAR = 3,
}
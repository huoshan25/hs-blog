/**
 * 文章模糊查询内容
 * @param params
 */
export async function getArticleQuery(params?: any) {
  return await fetchRequest.get<any>('/article/search', params);
}

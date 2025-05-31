import type {ArticleReq, ArticleRes, UrlPreview} from "~/api/home/type";

/**
 * 文章模糊查询
 * @param params
 */
export async function getArticleQuerySelect(params?: any) {
  return await fetchRequest.get<any>("/article/search-select", params);
}

/**
 * 文章查询
 * @param params
 */
export async function getArticle(params: ArticleReq) {
  return await fetchRequest.get<ArticleRes>("/article/list", params);
}

/**
 * 获取所有分类
 */
export async function getAllCategories(params?: any) {
  return await fetchRequest.get<any>("/category", params);
}

/**
 * url浏览
 */
export async function getArticleByUrl(params: { url: string }) {
  return await fetchRequest.get<UrlPreview>("/url-preview", params);
}

import type {ArticleReq, TagsAllRes, TagsListRes, TagsQueryArticleRes} from "~/api/tag/type";

export interface TagsList {
  id: number;
  name: string;
  articleCount: number;
}

/**
 * 查询全部标签
 */
export async function getTagsAll() {
  return await fetchRequest.get<TagsAllRes>("/tag");
}

/**
 * 文章标签(获取发布文章数量)
 */
export async function getTagsList() {
  return await fetchRequest.get<TagsListRes>("/article/tags");
}

/**
 * 标签查询文章
 */
export async function getTagsQueryArticle(params?: ArticleReq) {
  return await fetchRequest.get<TagsQueryArticleRes[]>("/tag/articles", params);
}

/**
 * 模糊搜索标签列表
 */
export async function getTagsQuery(params: { keyword: string }) {
  return await fetchRequest.get<TagsList[]>("/tag/search", params);
}

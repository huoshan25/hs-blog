import type {
  ArticleReq,
  CreateArticleReq,
  UpdateArticle,
  ArticleStatus,
  ArticleTTSReq
} from "@/api/article/type";

/**
 * 文章查询
 * @param params
 */
export async function getArticle(params?: ArticleReq) {
  return await request.get<any>("/article/list", params);
}

/**
 * 文章详情
 * @param params
 */
export async function getArticleDetails(params?: { id: number }) {
  return await request.get<any>("/article/details", params);
}

/**
 * 创建文章
 * @param params
 */
export async function createArticle(params?: CreateArticleReq) {
  return await request.post<any>("/article", params);
}

/**
 * 删除文章
 * @param params
 */
export async function deleteArticle(params?: { id: number }) {
  return await request.delete<any>("/article", params);
}

/**
 * 更改文章状态
 * @param params
 */
export async function editArticleStatus(params?: { ids: number[]; status: ArticleStatus }) {
  return await request.put<any>("/article/status", params);
}

/**
 * 更新文章信息
 * @param params
 */
export async function updateArticle(params?: UpdateArticle) {
  return await request.put<any>("/article", params);
}

/**
 * 文章标签
 */
export async function getTagsList() {
  return await request.get<any>("/article/tags");
}

/**
 * 删除图片
 */
export async function deletePicture(params: any) {
  return await request.delete<any>("/oss/ali/article-img", params);
}

/**
 * 更新文章时间
 */
export async function updatedArticleReleaseTime(params: any) {
  return await request.post<any>("/article/update-publish-time", params);
}

/**
 * 修改文章tts内容
 */
export async function updateArticleTTS(params: ArticleTTSReq) {
  return await request.put<null>("/article/tts", params);
}

/**
 * 生成对话音频
 */
export async function generateLongAudio(params: { content: string; articleUUID: number }) {
  return await request.post<{
    url: string;
    content: string;
  }>("/openai/generate-long-audio", params);
}

/**
 * 生成短文本音频
 */
export async function generateShortAudio(params: { content: string; articleUUID: number }) {
  return await request.post<{
    url: string;
    content: string;
  }>("/openai/generate-short-audio", params);
}
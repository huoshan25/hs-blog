/**文章状态*/
export enum ArticleStatus {
  /**草稿*/
  DRAFT = 1,
  /**发布*/
  PUBLISH = 2,
  /**删除*/
  DELETE = 3,
}

export interface ArticleReq {
  search?: string | null,
  page?: number,
  limit?: number,
  /**标题*/
  title?: string
  /**内容*/
  content?: string
  /**发布状态*/
  status?: ArticleStatus | null
  /**分类id*/
  categoryId?: number | null
}

export interface CreateArticleReq {
  /**分类id*/
  category_id: number | null | string;
  /**内容*/
  content: string;
  /**状态*/
  status: ArticleStatus;
  /**文章的标签*/
  tagNames: string[];
  /**标题*/
  title: string;
  /**文章描述*/
  description: string;
  /*文章UUID*/
  articleUUID: string;
  /*文章类型*/
  type: ArticleType;
  /*转载文章url*/
  link_url: string;
}

export enum ArticleType {
  /**原创*/
  ORIGINAL = 1,
  /**外链*/
  EXTERNAL = 2
}

export interface UpdateArticle extends Omit<CreateArticleReq, 'articleUUID'> {
  /**文章id*/
  id: string;
}

export interface ArticleTTSReq {
  id: number
  short_content: string
  short_audio_url: string;
  long_content: string;
  long_audio_url: string;
}
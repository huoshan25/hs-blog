export interface TagsAllRes {
  list: TagsList[];
  total: number;
}

export interface TagsList {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleReq {
  tagName: string;
  limit: number;
  page: number;
}

export interface TagsListRes {
  article_total: number;
  tag_total: number;
  tag_list: TagsList[];
}

export interface TagsQueryArticleRes {
  id: number;
  title: string;
  description: string;
  publish_time: string;
  category_info: categoryInfo;
  tags: TagsList[];
  view_count: number;
}

/*分类信息*/
export interface categoryInfo {
  id: number;
  /*分类别名*/
  alias: string;
  /*分类名称*/
  name: string;
  /*是否可编辑*/
  isEdit: boolean;
  icon: string;
  creation_time: string;
  update_time: string;
  /*分类排序*/
  sort: number;
}
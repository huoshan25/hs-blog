import type { ResponseData } from '../types'

/**
 * 评论信息
 */
export interface Comment {
  id: number
  content: string
  articleId: number
  userId: number
  parentId: number | null
  createdAt: string
  updatedAt: string
  user: {
    id: number
    username: string
    avatar: string | null
  }
}

/**
 * 评论查询参数
 */
export interface CommentQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  articleId?: number
}

/**
 * 评论列表响应
 */
export interface CommentListResponse extends ResponseData {
  data: {
    items: Comment[]
    total: number
  }
}

/**
 * 评论删除响应
 */
export interface DeleteCommentResponse extends ResponseData {
  data: null
} 
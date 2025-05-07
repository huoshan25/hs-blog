import type { CommentListResponse, CommentQueryParams, DeleteCommentResponse } from './types'

/**
 * 获取评论列表
 * @param params 查询参数
 */
export function getCommentList(params: CommentQueryParams) {
  return request.get<CommentListResponse>('/comments', params)
}

/**
 * 删除评论
 * @param id 评论ID
 */
export function deleteComment(id: number) {
  return request.delete<DeleteCommentResponse>(`/comments/${id}`)
}
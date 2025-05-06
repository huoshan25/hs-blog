import type {FriendLink, SearchFriendLinkParams, UpdateStatusParams} from "@/api/friendLink/type.ts";

/**
 * 获取所有友链，支持搜索参数
 * @param params 搜索参数
 */
export function getFriendLinks(params?: SearchFriendLinkParams) {
  return request.get<FriendLink[]>('/friend-links', params)
}

/**
 * 获取友链详情
 * @param id 友链ID
 */
export function getFriendLinkDetail(id: number) {
  return request.get<FriendLink>(`/friend-links/${id}`)
}

/**
 * 更新友链状态
 * @param id 友链ID
 * @param data 状态更新数据
 */
export function updateFriendLinkStatus(id: number, data: UpdateStatusParams) {
  return request.post<FriendLink>(`/friend-links/${id}/status`, data)
}

/**
 * 删除友链
 * @param id 友链ID
 */
export function deleteFriendLink(id: number) {
  return request.delete<{ message: string }>(`/friend-links/${id}`)
}

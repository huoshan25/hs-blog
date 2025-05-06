/**
 * 友链状态
 */
export enum FriendLinkStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * 友链数据接口
 */
export interface FriendLink {
  id: number
  name: string
  avatar: string
  description: string
  url: string
  category: string
  email: string
  status: FriendLinkStatus
  rejectReason?: string
  createdAt: string
  updatedAt: string
}

/**
 * 更新友链状态参数
 */
export interface UpdateStatusParams {
  status: FriendLinkStatus
  rejectReason?: string
}

/**
 * 获取所有友链
 */
export function getFriendLinks() {
  return request.get<FriendLink[]>('/friend-links')
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

export interface FriendLink {
  id: number
  name: string
  avatar: string
  description: string
  url: string
  tags?: string[]
  category: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface FriendLinkApplyForm {
  name: string
  url: string
  avatar: string
  description: string
  category: string
  email?: string
}

/**
 * 获取已批准的友链列表
 */
export function useGetFriendLinks() {
  return fetchRequest.get<FriendLink[]>('/friend-links')
}

/**
 * 申请友链
 * @param data 友链申请数据
 */
export function useApplyFriendLink(data: FriendLinkApplyForm) {
  return fetchRequest.post<{ message: string }>('/friend-links/apply', data)
} 
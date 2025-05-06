/**
 * 友链状态
 */
export enum FriendLinkStatus {
  /**审核*/
  PENDING = 'pending',
  /**批准*/
  APPROVED = 'approved',
  /**拒绝*/
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
 * 搜索友链参数
 */
export interface SearchFriendLinkParams {
  name?: string
  status?: FriendLinkStatus
  category?: string
}
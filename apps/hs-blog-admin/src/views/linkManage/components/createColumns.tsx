import { type DataTableColumns, NButton, NSpace, NTag, NPopconfirm, NImage } from 'naive-ui'
import { type FriendLink, FriendLinkStatus } from '@/api/friendLink/type.ts'

type Methods = {
  openStatusModal: (friendLink: FriendLink) => void
  handleDelete: (id: number) => void
}

/**
 * 创建友链管理表格列配置
 * @param methods 表格操作方法
 * @returns 表格列配置
 */
export const createColumns = (
  { openStatusModal, handleDelete }: Methods
): DataTableColumns<FriendLink> => {
  return [
    {
      title: 'ID',
      key: 'id',
      width: 80
    },
    {
      title: '网站',
      key: 'name',
      render(row: FriendLink) {
        return (
          <div class="flex flex-col">
            <div class="font-500 mb-[4px]">{row.name}</div>
            <a href={row.url} target="_blank" class="text-[12px] c-#2080f0">
              {row.url}
            </a>
          </div>
        )
      }
    },
    {
      title: '头像',
      key: 'avatar',
      width: 100,
      render(row: FriendLink) {
        return (
          <NImage
            src={row.avatar}
            width={50}
            height={50}
            objectFit="cover"
            class="rounded-md"
          />
        )
      }
    },
    {
      title: '描述',
      key: 'description',
      render(row: FriendLink) {
        return <div>{row.description}</div>
      },
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render(row: FriendLink) {
        return <NTag type="primary" bordered={false}>{row.category}</NTag>
      }
    },
    {
      title: '邮箱',
      key: 'email',
      width: 200
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render(row: FriendLink) {
        const statusMap = {
          [FriendLinkStatus.PENDING]: { type: 'warning', text: '待审核' },
          [FriendLinkStatus.APPROVED]: { type: 'success', text: '已批准' },
          [FriendLinkStatus.REJECTED]: { type: 'error', text: '已拒绝' }
        }
        const statusInfo = statusMap[row.status]
        return <NTag type={statusInfo.type as any} bordered={false}>{statusInfo.text}</NTag>
      }
    },
    {
      title: '申请时间',
      key: 'createdAt',
      width: 180,
      render(row: FriendLink) {
        return new Date(row.createdAt).toLocaleString()
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render(row: FriendLink) {
        return (
          <NSpace size="small">
            <NButton
              size="small"
              type="primary"
              ghost
              onClick={() => openStatusModal(row)}
            >
              修改状态
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => '确定要删除该友链吗？',
                trigger: () => (
                  <NButton size="small" type="error" ghost>
                    删除
                  </NButton>
                )
              }}
            </NPopconfirm>
          </NSpace>
        )
      }
    }
  ]
} 
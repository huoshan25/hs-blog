<script setup lang="ts">
import { NButton, NSpace, NTag, NPopconfirm,  type FormInst, useMessage, NImage, NModal, type FormRules, NForm, NFormItem, NRadio, NRadioGroup, NInput } from 'naive-ui'
import { getFriendLinks, deleteFriendLink, updateFriendLinkStatus, type FriendLink, FriendLinkStatus } from '@/api/friendLink'

onMounted(() => {
  loadFriendLinks()
})

const message = useMessage()
const loading = ref(false)
const friendLinks = ref<FriendLink[]>([])
const showStatusModal = ref(false)
const formRef = ref<FormInst | null>(null)

/**当前操作的友链*/
const currentFriendLink = ref<FriendLink | null>(null)

const statusForm = reactive({
  status: FriendLinkStatus.PENDING,
  rejectReason: ''
})

const rules: FormRules = {
  status: {
    required: true,
    message: '请选择审核状态',
    trigger: 'change'
  },
  rejectReason: {
    required: false,
    trigger: 'blur'
  }
}

const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '网站',
    key: 'name',
    render(row: FriendLink) {
      return h('div', { class: 'flex flex-col' }, [
        h('div', { class: 'font-500 mb-[4px]' }, row.name),
        h('a', { href: row.url, target: '_blank', class: 'text-[12px] c-#2080f0' }, row.url)
      ])
    }
  },
  {
    title: '头像',
    key: 'avatar',
    width: 100,
    render(row: FriendLink) {
      return h(NImage, {
        src: row.avatar,
        width: 50,
        height: 50,
        objectFit: 'cover',
        borderRadius: '4px'
      })
    }
  },
  {
    title: '描述',
    key: 'description',
    render(row: FriendLink) {
      return h('div', row.description)
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
      return h(NTag, { type: 'primary', bordered: false }, {
        default: () => row.category
      })
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
      return h(NTag, { type: statusInfo.type as any, bordered: false }, {
        default: () => statusInfo.text
      })
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
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => openStatusModal(row)
          }, { default: () => '修改状态' }),
          h(NPopconfirm, {
            onPositiveClick: () => handleDelete(row.id)
          }, {
            default: () => '确定要删除该友链吗？',
            trigger: () => h(NButton, {
              size: 'small',
              type: 'error',
              ghost: true
            }, { default: () => '删除' })
          })
        ]
      })
    }
  }
]

/**加载友链数据*/
const loadFriendLinks = async () => {
  loading.value = true
  try {
    const { data } = await getFriendLinks()
    friendLinks.value = data
  } catch (err) {
    console.error('获取友链失败:', err)
    message.error('获取友链数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 打开状态修改模态框
 * @param friendLink 友链
 */
const openStatusModal = (friendLink: FriendLink) => {
  currentFriendLink.value = friendLink
  statusForm.status = friendLink.status
  statusForm.rejectReason = friendLink.rejectReason || ''
  showStatusModal.value = true
}

/**提交状态修改*/
const handleStatusSubmit = async () => {
  if (!currentFriendLink.value) return
  
  try {
    formRef.value?.validate(async (errors) => {
      if (errors) return
      
      // 如果是拒绝状态但没有提供拒绝原因
      if (statusForm.status === FriendLinkStatus.REJECTED && !statusForm.rejectReason) {
        message.warning('请提供拒绝原因')
        return
      }
      
      const { data } = await updateFriendLinkStatus(currentFriendLink.value!.id, {
        status: statusForm.status,
        rejectReason: statusForm.status === FriendLinkStatus.REJECTED ? statusForm.rejectReason : undefined
      })
      
      // 更新本地数据
      const index = friendLinks.value.findIndex(item => item.id === currentFriendLink.value!.id)
      if (index !== -1) {
        friendLinks.value[index] = data
      }
      
      message.success('状态更新成功')
      showStatusModal.value = false
    })
  } catch (err) {
    console.error('更新友链状态失败:', err)
    message.error('更新友链状态失败')
  }
}

/**删除友链*/
const handleDelete = async (id: number) => {
  try {
    await deleteFriendLink(id)
    message.success('删除成功')
    // 更新本地数据
    friendLinks.value = friendLinks.value.filter(item => item.id !== id)
  } catch (err) {
    console.error('删除友链失败:', err)
    message.error('删除友链失败')
  }
}
</script>

<template>
  <div>
    <n-card title="友链列表">
      <n-data-table
        :columns="columns"
        :data="friendLinks"
        :loading="loading"
        :pagination="{
          pageSize: 10
        }"
        :max-height="700"
        :scroll-x="1300"
      />
    </n-card>

    <!-- 状态修改模态框 -->
    <n-modal
      v-model:show="showStatusModal"
      preset="card"
      title="修改友链状态"
      style="width: 500px"
    >
      <n-form
        ref="formRef"
        :model="statusForm"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="状态" path="status">
          <n-radio-group v-model:value="statusForm.status">
            <n-space>
              <n-radio :value="FriendLinkStatus.APPROVED">
                批准
              </n-radio>
              <n-radio :value="FriendLinkStatus.REJECTED">
                拒绝
              </n-radio>
              <n-radio :value="FriendLinkStatus.PENDING">
                待审核
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item
          v-if="statusForm.status === FriendLinkStatus.REJECTED"
          label="拒绝原因"
          path="rejectReason"
        >
          <n-input
            v-model:value="statusForm.rejectReason"
            type="textarea"
            placeholder="请输入拒绝原因"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showStatusModal = false">
            取消
          </n-button>
          <n-button type="primary" @click="handleStatusSubmit">
            确认
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
</style>
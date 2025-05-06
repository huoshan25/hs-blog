<script setup lang="ts">
import { type FormInst, type FormRules } from 'naive-ui'
import { deleteFriendLink, getFriendLinks } from '@/api/friendLink'
import {
  type FriendLink,
  FriendLinkStatus,
  type SearchFriendLinkParams,
} from '@/api/friendLink/type.ts'
import { createColumns } from './components/createColumns'
import { ReloadOutline, Search } from '@vicons/ionicons5'
import { HttpStatus } from '@/enums/httpStatus.ts'
import LinkStatusModal from './components/linkStatusModal.vue'

onMounted(() => {
  loadFriendLinks()
})

const message = useMessage()
const loading = ref(false)
const friendLinks = ref<FriendLink[]>([])
const showStatusModal = ref(false)

const searchFormRef = ref<FormInst | null>(null)

/**当前操作的友链*/
const currentFriendLink = ref<FriendLink | null>(null)

const statusForm = reactive({
  status: FriendLinkStatus.PENDING,
  rejectReason: '',
})

const searchForm = reactive<SearchFriendLinkParams>({
  name: '',
  status: undefined,
  category: undefined,
})

const searchRules: FormRules = {
  name: {
    required: false,
    trigger: ['blur', 'input'],
  },
  status: {
    required: false,
    trigger: 'change',
  },
  category: {
    required: false,
    trigger: 'change',
  },
}

const categoryOptions = ref([
  { label: '技术博客', value: '技术博客' },
  { label: '生活博客', value: '生活博客' },
  { label: '设计博客', value: '设计博客' },
  { label: '其他', value: '其他' },
])

const statusOptions = [
  { label: '待审核', value: FriendLinkStatus.PENDING },
  { label: '已批准', value: FriendLinkStatus.APPROVED },
  { label: '已拒绝', value: FriendLinkStatus.REJECTED },
]

/**加载友链数据*/
const loadFriendLinks = async (params?: SearchFriendLinkParams) => {
  loading.value = true
  try {
    const queryParams = params || {
      name: searchForm.name || undefined,
      status: searchForm.status || undefined,
      category: searchForm.category || undefined,
    }
    const res = await getFriendLinks(queryParams)
    if (res.code === HttpStatus.OK) {
      friendLinks.value = res.data
    }
  } catch (err) {
    console.error('获取友链失败:', err)
    message.error('获取友链数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadFriendLinks()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = undefined
  searchForm.category = undefined
  loadFriendLinks({})
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

/**删除友链*/
const handleDelete = async (id: number) => {
  const res = await deleteFriendLink(id)
  if (res.code === HttpStatus.OK) {
    message.success('删除成功')
    await loadFriendLinks()
  }
}

const columns = ref(
  createColumns({
    openStatusModal,
    handleDelete,
  }),
)
</script>

<template>
  <n-form
    ref="searchFormRef"
    :model="searchForm"
    :rules="searchRules"
    inline
    label-placement="left"
    label-width="auto"
    size="small"
    class="my-[10px]"
  >
    <n-form-item label="网站" path="name">
      <n-input
        v-model:value="searchForm.name"
        placeholder="输入网站名称或链接"
        clearable
        style="width: 200px"
      />
    </n-form-item>

    <n-form-item label="状态" path="status">
      <n-select
        v-model:value="searchForm.status"
        :options="statusOptions"
        placeholder="请选择状态"
        clearable
        style="width: 150px"
      />
    </n-form-item>

    <n-form-item label="分类" path="category">
      <n-select
        v-model:value="searchForm.category"
        :options="categoryOptions"
        placeholder="请选择分类"
        clearable
        style="width: 150px"
      />
    </n-form-item>

    <n-space>
      <n-button type="primary" @click="handleSearch">
        <template #icon>
          <n-icon>
            <Search />
          </n-icon>
        </template>
        查询
      </n-button>

      <n-button @click="resetSearch">
        <template #icon>
          <n-icon>
            <ReloadOutline />
          </n-icon>
        </template>
        重置
      </n-button>
    </n-space>
  </n-form>

  <n-data-table
    :columns="columns"
    :data="friendLinks"
    :loading="loading"
    :pagination="{
      pageSize: 10,
    }"
    :max-height="700"
    :scroll-x="1300"
    empty-text="暂无数据"
  />

  <!-- 状态修改模态框 -->
  <n-modal v-model:show="showStatusModal" preset="card" title="修改友链状态" style="width: 500px">
    <LinkStatusModal
      v-model:showStatusModal="showStatusModal"
      :current-friend-link="currentFriendLink"
      :load-friend-links="loadFriendLinks"
    />
  </n-modal>
</template>

<style scoped lang="scss"></style>

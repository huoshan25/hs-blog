<script setup lang="ts">
import { NCard, NSpace, NDataTable, NButton, NPagination, NPopconfirm, NEmpty, NInput } from 'naive-ui'
import { ref, h, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { getCommentList, deleteComment } from '@/api/comment'
import type { Comment, CommentQueryParams } from '@/api/comment/types'

const message = useMessage()
const loading = ref(false)
const comments = ref<Comment[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page
    fetchComments()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchComments()
  }
})

const searchParams = reactive<CommentQueryParams>({
  keyword: '',
  articleId: undefined
})

// 获取评论列表
const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getCommentList({
      ...searchParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    
    if (res.code === 200) {
      comments.value = res.data.items
      pagination.itemCount = res.data.total
    }
  } catch (error) {
    console.error('获取评论列表失败', error)
    message.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

// 删除评论
const handleDeleteComment = async (id: number) => {
  try {
    const res = await deleteComment(id)
    if (res.code === 200) {
      message.success('删除成功')
      fetchComments()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除评论失败', error)
    message.error('删除评论失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchComments()
}

// 重置搜索
const resetSearch = () => {
  searchParams.keyword = ''
  searchParams.articleId = undefined
  pagination.page = 1
  fetchComments()
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '内容',
    key: 'content',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '用户',
    key: 'user',
    width: 120,
    render(row: Comment) {
      return row.user?.username || '未知用户'
    }
  },
  {
    title: '文章ID',
    key: 'articleId',
    width: 100
  },
  {
    title: '时间',
    key: 'createdAt',
    width: 180,
    render(row: Comment) {
      return new Date(row.createdAt).toLocaleString('zh-CN')
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row: Comment) {
      return h(
        NSpace,
        { align: 'center', justify: 'center' },
        {
          default: () => [
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDeleteComment(row.id)
              },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    ghost: true
                  },
                  { default: () => '删除' }
                ),
                default: () => '确定要删除这条评论吗？'
              }
            )
          ]
        }
      )
    }
  }
]

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="comment-manage">
    <n-card title="评论管理" size="small">
      <!-- 搜索区 -->
      <n-space vertical size="medium">
        <n-space>
          <n-input
            v-model:value="searchParams.keyword"
            placeholder="评论内容"
            clearable
            style="width: 200px"
            @keydown.enter="handleSearch"
          />
          <n-input
            v-model:value="searchParams.articleId"
            placeholder="文章ID"
            clearable
            style="width: 200px"
            @keydown.enter="handleSearch"
          />
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button @click="resetSearch">重置</n-button>
        </n-space>
        
        <!-- 表格 -->
        <n-data-table
          :columns="columns"
          :data="comments"
          :loading="loading"
          :row-key="row => row.id"
          :pagination="false"
          striped
          remote
        />
        
        <!-- 空状态 -->
        <n-empty v-if="!loading && comments.length === 0" description="暂无评论数据" />
        
        <!-- 分页 -->
        <div v-if="pagination.itemCount > 0" style="margin-top: 12px; display: flex; justify-content: flex-end">
          <n-pagination v-model:page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-count="Math.ceil(pagination.itemCount / pagination.pageSize)"
            :page-sizes="pagination.pageSizes"
            :item-count="pagination.itemCount"
            show-size-picker
            show-quick-jumper
            @update:page="pagination.onChange"
            @update:page-size="pagination.onUpdatePageSize"
          />
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.comment-manage {
  padding: 16px;
}
</style>
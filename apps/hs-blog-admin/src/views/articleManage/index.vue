<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import { type ArticleReq, ArticleStatus } from '@/api/article/type'
import { deleteArticle, editArticleStatus, getArticle } from '@/api/article'
import { getAllCategories } from '@/api/categories'
import { HttpStatus } from '@/enums/httpStatus'
import { NButton, NIcon } from 'naive-ui'
import markdownEditor from './components/markdownEditor/index.vue'
import { createColumns } from '@/views/articleManage/components/createColumns.tsx'

const message = useMessage()
const dialog = useDialog()

export interface Row {
  id: number
  status: number
  category_name: string
  title: string
  create_time: string
  update_time: string
  publish_time: string
}

const total = ref(0)

/**是否新增或编辑文章*/
const articleEditorVisibility = ref(false)
/**选中文章id*/
const checkedRowKeysRef = ref<number[]>([])
/**选中数据过滤*/
const rowKey = (row: Row) => row.id
const handleCheck = (rowKeys: (string | number)[]) => {
  checkedRowKeysRef.value = rowKeys as number[]
}

const form = ref<ArticleReq>({
  search: null,
  title: '',
  categoryId: null,
  status: null,
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  prefix() {
    return `共 ${total.value} 条`
  },
  itemCount: computed(() => total.value),
  onChange(page: number) {
    pagination.page = page
    getList()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    getList()
  },
})

const handleQuery = () => {
  getList()
}

/**分类选项*/
const categoryOption = ref([])

/**文章状态选项*/
const statusOption = [
  {
    label: '草稿',
    value: ArticleStatus.DRAFT,
  },
  {
    label: '发布',
    value: ArticleStatus.PUBLISH,
  },
  {
    label: '删除',
    value: ArticleStatus.DELETE,
  },
]

const loading = ref(false)
const tableData = ref<Row[]>([])

/**列表数据*/
const getList = async () => {
  loading.value = true
  const params = {
    ...form.value,
    page: pagination.page,
    limit: pagination.pageSize,
  }
  const res = await getArticle(params)
  if (res.code === HttpStatus.OK) {
    tableData.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
}
const router = useRouter()
/**
 * 新增/编辑文章
 * @param type
 * @param row
 */
const newArticle = (type: string, row?: Row) => {
  articleEditorVisibility.value = true
  editorType.value = type
  editorList.value = {
    type,
    ...row,
    categoryOption: categoryOption.value,
  }
  // navigateTo(`/admin/articleEditor/detail/${row?.id}`);
  // router.push({name: 'articleEditor', params: {type, row}})
}

/**关闭编辑文章*/
const closeEditor = () => {
  articleEditorVisibility.value = false
  getList()
}
/**编辑状态*/
const editorType = ref<string>('')
/**文章数据*/
const editorList = ref()

/**确认删除*/
const handlePositiveClick = (id: number | null, status: ArticleStatus) => {
  dialog.warning({
    title: '确定要删除吗',
    content: '文章将变成已删除状态， 你可以随时恢复。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const ids = id ? [id] : checkedRowKeysRef.value
      const res = await editArticleStatus({ ids, status })
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })
}

/**真实删除*/
const handleDeleteArticle = (id: number) => {
  dialog.warning({
    title: '确定要永久删除吗？',
    content: () => h('div', { style: { color: '#f0a020' } }, '文章将被永久删除，删除后不可恢复！'),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await deleteArticle({ id })
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })
}

/**恢复文章*/
const handleRecover = (ids: number[]) => {
  dialog.warning({
    title: '确定要恢复文章吗？',
    content: '文章将变成草稿状态，你需要手动进行发布',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await editArticleStatus({ ids, status: ArticleStatus.DRAFT })
      if (res.code === HttpStatus.OK) {
        message.success(res.message)
        await getList()
      }
    },
  })
}

const columns = ref(
  createColumns({
    handleDeleteArticle,
    handlePositiveClick,
    handleRecover,
    newArticle,
    getList,
  }),
)
onMounted(async () => {
  const res = await getAllCategories()
  if (res.code === HttpStatus.OK) {
    categoryOption.value = res.data.map((item: { id: number | string; name: string }) => {
      return {
        value: item.id,
        label: item.name,
      }
    })
  }
  await getList()
})
</script>

<template>
  <div v-show="!articleEditorVisibility">
    <div class="form-container">
      <n-form
        ref="formRef"
        inline
        label-placement="left"
        label-align="left"
        :model="form"
        size="small"
      >
        <div class="form-row">
          <n-form-item label="文章id">
            <n-input
              v-model:value="form.search"
              type="text"
              placeholder="请输入文章id/标题"
              clearable
            />
          </n-form-item>
          <n-form-item label="标题">
            <n-input v-model:value="form.title" placeholder="请输入标题" clearable />
          </n-form-item>
          <n-form-item label="分类">
            <n-select
              class="w-[130px]"
              filterable
              placeholder="请选择"
              v-model:value="form.categoryId"
              :options="categoryOption"
              clearable
            />
          </n-form-item>
          <n-form-item label="文章状态" path="status">
            <n-select
              class="w-[100px]"
              v-model:value="form.status"
              :options="statusOption"
              clearable
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleQuery" class="mb-[10px]">
              <template #icon>
                <n-icon size="14">
                  <Search />
                </n-icon>
              </template>
              查询
            </n-button>
          </n-form-item>
        </div>
      </n-form>
    </div>

    <div m-b-15 flex>
      <n-button
        :disabled="checkedRowKeysRef.length === 0"
        size="small"
        class="mr-[15px]"
        @click="handlePositiveClick(null, ArticleStatus.DELETE)"
      >
        {{ checkedRowKeysRef.length > 0 ? `删除 ${checkedRowKeysRef.length} 项` : '删除' }}
      </n-button>
      <n-button size="small" @click="newArticle('add')" dashed>
        <template #icon>
          <img class="h-[15px]" src="/svg/plusSign.svg" />
        </template>
        新增文章
      </n-button>
    </div>

    <n-spin :show="loading">
      <template #description> 我知道你很急，但是你先别急。</template>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"
        :bordered="false"
        size="medium"
        remote
      />
    </n-spin>
  </div>

  <!-- 新增/编辑文章 -->
  <markdown-editor
    v-if="articleEditorVisibility"
    :visible="articleEditorVisibility"
    :type="editorType"
    :currentRow="editorList"
    @close="closeEditor"
  />
</template>

<style scoped lang="scss">
.form-container {
  display: flex;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* 控制表单项之间的间距 */
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
}
</style>

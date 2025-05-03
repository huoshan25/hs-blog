<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { HelpCircleOutline, InformationCircleOutline } from '@vicons/ionicons5'
import { HttpStatus } from '@/enums/httpStatus'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '@/api/categories'
import type { FormItemRule } from 'naive-ui'
import { createColumns } from '@/views/categoryManage/components/createColumns.tsx'

const message = useMessage()
const dialog = useDialog()

export interface Row {
  sort: number
  id: number
  icon: string
  name: string
  alias: string
  article_count: string
  creation_time: string
  update_time: string
  isEdit: boolean
}

const total = ref(0)

/**分页*/
const pagination = {
  prefix() {
    return `共 ${total.value} 条`
  },
}
/**选中分类id*/
const checkedRowKeysRef = ref<number[]>([])
/**选中数据过滤*/
const rowKey = (row: Row) => row.id
const handleCheck = (rowKeys: (string | number)[]) => {
  checkedRowKeysRef.value = rowKeys as number[]
}

/**表格数据*/
const tableData = ref<Row[]>([])

/**删除分类*/
const handleDeleteCategory = async (id?: number) => {
  dialog.warning({
    title: '确定要永久删除吗？',
    content: () => h('div', { style: { color: '#f0a020' } }, '分类将被永久删除，删除后不可恢复！'),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const ids = id ? [id] : checkedRowKeysRef.value
      const res = await deleteCategory({ ids })
      if (res.code === HttpStatus.OK) {
        message.success('删除成功！')
        await getList()
      }
    },
  })
}

/**新增/编辑分类*/
const handleCategory = async (id: number | null, type: string) => {
  categoryVisibility.value = !categoryVisibility.value
  // 重置表单状态
  form.value = {
    id: 0,
    sort: 0,
    icon: '',
    name: '',
    alias: '',
  }
  imageUrl.value = ''
  fileList.value = []
  imageFile.value = null

  if (type === 'edit' && id) {
    categoryDialogTitle.value = '编辑分类'
    form.value.id = id
    const res = await getCategory(id)
    if (res.code === HttpStatus.OK) {
      form.value.sort = res.data.sort
      form.value.name = res.data.name
      form.value.alias = res.data.alias
      fileList.value = [
        {
          id: res.data.id,
          name: `${res.data.icon.split('/').pop()}`, // 生成一个文件名
          status: 'finished',
          url: res.data.icon,
          thumbnailUrl: res.data.icon, // 缩略图URL
        },
      ]
      imageUrl.value = res.data.icon
    }
  } else {
    categoryDialogTitle.value = '新增分类'
  }
}

/**分类弹窗*/
const categoryVisibility = ref(false)

const categoryDialogTitle = ref('')

const form = ref({
  id: 0,
  sort: 0,
  icon: '',
  name: '',
  alias: '',
})

watch(categoryVisibility, (newVal) => {
  if (!newVal) {
    // 当模态框关闭时重置表单
    if (!form.value.id) {
      // 如果不是编辑状态
      form.value = {
        id: 0,
        sort: 0,
        icon: '',
        name: '',
        alias: '',
      }
      imageUrl.value = ''
      fileList.value = []
      imageFile.value = null
    }
  }
})

const formRef = ref()

const imageFile = ref<File | null>(null)

const loading = ref(false)

const rules: any = {
  sort: {
    required: true,
    message: '请输入排序',
    trigger: 'blur',
    type: 'number',
  },
  icon: {
    required: true,
    message: '请上传分类图标',
    trigger: ['change', 'blur'],
    validator: (rule: FormItemRule, value: string) => {
      if (!imageFile.value && !(form.value.id && imageUrl.value)) {
        return new Error('请上传分类图标')
      }
      return true
    },
  },
  name: {
    required: true,
    message: '请输入分类名称',
    trigger: 'blur',
  },
  alias: {
    required: true,
    message: '请输入Alias',
    trigger: 'blur',
  },
}

/**不允许排序的值前后有空格*/
const noSideSpace = (value: string) => !value.startsWith(' ') && !value.endsWith(' ')

/**列表*/
const getList = async () => {
  loading.value = true
  const res = await getAllCategories()
  if (res.code === HttpStatus.OK) {
    tableData.value = res.data
    total.value = res.data.length
    loading.value = false
  }
}

const clearImagePreview = () => {
  imageUrl.value = ''
  fileList.value = []
  imageFile.value = null
}

const handleUploadChange = (options: any) => {
  fileList.value = options.fileList
  if (options.fileList.length === 0) {
    clearImagePreview()
  } else {
    const file = options.fileList[0].file
    imageFile.value = file

    // 预览图像
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

/**提交*/
const handleSubmit = async () => {
  await formRef.value?.validate()
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('alias', form.value.alias)
  formData.append('sort', form.value.sort.toString())

  if (imageFile.value) {
    formData.append('category_image', imageFile.value)
  }

  try {
    if (form.value.id) {
      formData.append('id', form.value.id.toString())
      await updateCategory(formData)
      message.success('更新分类成功')
    } else {
      await createCategory(formData)
      message.success('添加分类成功')
    }
    categoryVisibility.value = false
    await getList()
  } catch (error) {
    message.error('操作失败')
  }
}

const columns = ref(
  createColumns({
    handleCategory,
    handleDeleteCategory,
  }),
)

onMounted(async () => {
  await getList()
})

const imageUrl = ref('')
const fileList = ref<any>([])
</script>

<template>
  <div class="form-container"></div>

  <div class="mb-[15px] flex">
    <n-button
      @click="handleDeleteCategory()"
      :disabled="checkedRowKeysRef.length == 0"
      size="small"
      class="mr-[15px]"
    >
      {{ checkedRowKeysRef.length > 0 ? `删除 ${checkedRowKeysRef.length} 项` : '删除' }}
    </n-button>
    <n-button size="small" @click="handleCategory(null, 'add')" dashed>
      <template #icon>
        <img class="h-[15px]" src="/svg/plusSign.svg" />
      </template>
      新增分类
    </n-button>
  </div>

  <n-spin :show="loading">
    <template #description> 生活偶尔需要放慢下脚步...</template>
    <n-data-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :row-key="rowKey"
      @update:checked-row-keys="handleCheck"
      :bordered="false"
      size="medium"
    />
  </n-spin>

  <n-modal v-model:show="categoryVisibility">
    <n-card
      class="w-[500px]"
      :title="categoryDialogTitle"
      :segmented="{
        content: true,
      }"
    >
      <n-form ref="formRef" :model="form" :rules="rules" size="small" require-mark-placement="left">
        <n-form-item label="分类图标" path="icon">
          <div style="width: 100%">
            <div class="flex items-center color-gray mb-[6px]">
              <n-icon class="mr-[3px]">
                <InformationCircleOutline />
              </n-icon>
              你可以在
              <nuxt-link class="mx-[4px]" to="https://www.iconfont.cn" color-blue target="_blank">
                阿里巴巴矢量图标库
              </nuxt-link>
              搜索和下载喜欢的图标。
            </div>
            <n-upload
              accept="image/*"
              :max="1"
              :default-file-list="fileList"
              @change="handleUploadChange"
              :show-file-list="true"
            >
              <n-button>选择图片</n-button>
            </n-upload>
            <div v-if="imageUrl" class="image-preview">
              <img :src="imageUrl" alt="预览图片" />
            </div>
          </div>
        </n-form-item>
        <n-form-item label="分类名称" path="name">
          <n-input v-model:value="form.name" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item path="alias">
          <template #label>
            <div class="flex items-center">
              分类别名
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon class="color-gray ml-[3px]">
                    <HelpCircleOutline />
                  </n-icon>
                </template>
                分类别名，如：NuxtJs，将作为URL的一部分
              </n-tooltip>
            </div>
          </template>
          <n-input v-model:value="form.alias" placeholder="请输入Alias" />
        </n-form-item>
        <n-form-item label="排序" path="sort">
          <n-input-number
            v-model:value="form.sort"
            class="w-[140px]"
            :allow-input="noSideSpace"
            placeholder="请输入排序"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <div class="text-right">
          <n-button class="mr-[10px]" @click="categoryVisibility = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit">提交</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
th {
  text-align: center;
}

td {
  text-align: center;
}

.image-upload-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.image-preview {
  max-width: 300px;
  max-height: 300px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: auto;
}
</style>

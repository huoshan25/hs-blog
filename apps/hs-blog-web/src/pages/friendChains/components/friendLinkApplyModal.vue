<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: any): void
}>()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  name: '',
  url: '',
  avatar: '',
  description: '',
  category: '',
  email: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入网站名称' }
  ],
  url: [
    { required: true, message: '请输入网站地址' },
    { type: 'url', message: '请输入有效的URL' }
  ],
  avatar: [
    { required: true, message: '请输入头像地址' },
    { type: 'url', message: '请输入有效的URL' }
  ],
  description: [
    { required: true, message: '请输入网站描述' }
  ],
  category: [
    { required: true, message: '请选择网站分类' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ]
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  emit('submit', formValue.value)
  emit('update:show', false)
}
</script>

<template>
  <n-modal
      :show="show"
      preset="card"
      title="申请友链"
      style="max-width: 600px"
      :mask-closable="false"
      @update:show="emit('update:show', $event)"
  >
    <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
    >
      <n-form-item label="网站名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="请输入网站名称" />
      </n-form-item>

      <n-form-item label="网站地址" path="url">
        <n-input v-model:value="formValue.url" placeholder="请输入网站地址" />
      </n-form-item>

      <n-form-item label="头像地址" path="avatar">
        <n-input v-model:value="formValue.avatar" placeholder="请输入头像地址" />
      </n-form-item>

      <n-form-item label="网站描述" path="description">
        <n-input
            v-model:value="formValue.description"
            type="textarea"
            placeholder="请简短描述您的网站"
        />
      </n-form-item>

      <n-form-item label="网站分类" path="category">
        <n-select
            v-model:value="formValue.category"
            :options="[
            { label: '技术博客', value: '技术博客' },
            { label: '生活博客', value: '生活博客' },
            { label: '设计博客', value: '设计博客' },
            { label: '其他', value: '其他' }
          ]"
            placeholder="请选择网站分类"
        />
      </n-form-item>

      <n-form-item label="联系邮箱" path="email">
        <n-input v-model:value="formValue.email" placeholder="请输入邮箱地址" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="end">
        <n-button @click="emit('update:show', false)">
          取消
        </n-button>
        <n-button type="primary" @click="handleSubmit">
          提交申请
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
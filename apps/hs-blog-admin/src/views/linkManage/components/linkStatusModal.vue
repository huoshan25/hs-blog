<script setup lang="ts">
import { type FriendLink, FriendLinkStatus } from '@/api/friendLink/type.ts'
import { updateFriendLinkStatus } from '@/api/friendLink'
import { HttpStatus } from '@/enums/httpStatus.ts'
import type { FormInst, FormRules } from 'naive-ui'

const props = defineProps<{
  showStatusModal: boolean
  currentFriendLink: FriendLink | null
  loadFriendLinks: () => Promise<void>
}>()

const emit = defineEmits(['update:showStatusModal'])

const formRef = ref<FormInst | null>(null)

const message = useMessage()

const statusForm = reactive({
  status: props.currentFriendLink?.status || FriendLinkStatus.PENDING,
  rejectReason: '',
})

const rules: FormRules = {
  status: {
    required: true,
    message: '请选择审核状态',
    trigger: 'change',
  },
  rejectReason: {
    required: false,
    trigger: 'blur',
  },
}

/**提交状态修改*/
const handleStatusSubmit = async () => {
  if (!props.currentFriendLink) return

  await formRef.value?.validate()

  // 如果是拒绝状态但没有提供拒绝原因
  if (statusForm.status === FriendLinkStatus.REJECTED && !statusForm.rejectReason) {
    message.warning('请提供拒绝原因')
    return
  }

  const res = await updateFriendLinkStatus(props.currentFriendLink!.id, {
    status: statusForm.status,
    rejectReason:
      statusForm.status === FriendLinkStatus.REJECTED ? statusForm.rejectReason : undefined,
  })

  if (res.code === HttpStatus.OK) {
    message.success('状态更新成功')
    closeModal()
    await props.loadFriendLinks()
  }
}

const closeModal = () => {
  emit('update:showStatusModal', false)
}
</script>

<template>
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
          <n-radio :value="FriendLinkStatus.APPROVED">批准</n-radio>
          <n-radio :value="FriendLinkStatus.REJECTED">拒绝</n-radio>
          <n-radio :value="FriendLinkStatus.PENDING">待审核</n-radio>
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

  <n-space justify="end">
    <n-button @click="closeModal">取消</n-button>
    <n-button type="primary" @click="handleStatusSubmit"> 确认</n-button>
  </n-space>
</template>

<style scoped lang="scss"></style>

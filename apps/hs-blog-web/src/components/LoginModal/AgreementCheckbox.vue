<script setup lang="ts">

const router = useRouter()
const checked = ref(false)
const emit = defineEmits(['update:checked'])

const { hideLoginModal } = useUser()

defineExpose({ checked })

const updateChecked = (value: boolean) => {
  checked.value = value
  emit('update:checked', value)
}

const navigateTo = (path: string) => {
  hideLoginModal()
  router.push(path)
}
</script>

<template>
  <div class="agreement-container">
    <n-checkbox v-model:checked="checked" @update:checked="updateChecked">
      我已阅读并同意
    </n-checkbox>
    <n-button text type="primary" @click="navigateTo('/terms')">《服务条款》</n-button>
    <span>和</span>
    <n-button text type="primary" @click="navigateTo('/privacy')">《隐私政策》</n-button>
  </div>
</template>

<style scoped>
.agreement-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0;
  font-size: 14px;
  color: #666;
}

.agreement-container :deep(.n-button) {
  padding: 0 4px;
  height: auto;
  line-height: 1.5;
  font-size: 14px;
}
</style> 
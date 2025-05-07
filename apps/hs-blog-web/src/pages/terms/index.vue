<script setup lang="ts">
import TermsOfService from './components/TermsOfService.vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '服务条款',
  meta: [
    {
      name: 'description',
      content: '火山博客服务条款 - 使用我们的服务即表示您同意这些条款'
    }
  ]
})
</script>

<template>
  <div class="page-container">
    <TermsOfService />
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px 16px;
  display: flex;
  justify-content: center;
}
</style> 
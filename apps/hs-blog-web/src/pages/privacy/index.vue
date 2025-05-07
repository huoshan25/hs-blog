<script setup lang="ts">
import PrivacyPolicy from './components/PrivacyPolicy.vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '隐私政策',
  meta: [
    {
      name: 'description',
      content: '火山博客隐私政策 - 了解我们如何收集、使用和保护您的个人信息'
    }
  ]
})
</script>

<template>
  <div class="page-container">
    <PrivacyPolicy />
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px 16px;
  display: flex;
  justify-content: center;
}
</style> 
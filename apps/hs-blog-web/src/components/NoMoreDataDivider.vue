<script setup lang="ts">
defineProps({
  hasMore: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="no-data-container">
    <div class="dashed-line"></div>
    <div class="content">
      <template v-if="hasMore">
        <n-spin size="small">
          <template #description>加载中...</template>
        </n-spin>
      </template>
      <template v-else>
        <slot>没有更多数据</slot>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
}

.dashed-line {
  width: 100%;
  border-top: 1px dashed #ccc;
  margin-bottom: 10px;
}

.content {
  color: #999;
  font-size: 14px;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatDate, getRelativeTime, truncate, formatNumber, HttpStatus, BusinessStatus } from 'web-shared';

// 日期工具函数示例
const currentDate = ref(new Date());
const formattedDate = ref(formatDate(currentDate.value, 'YYYY-MM-DD HH:mm:ss'));
const relativeTime = ref(getRelativeTime(new Date(Date.now() - 5 * 60 * 1000))); // 5分钟前

// 字符串工具函数示例
const longText = "这是一段很长的文本，将被截断并添加省略号";
const truncatedText = ref(truncate(longText, 10));

// 数字格式化示例
const largeNumber = 1234567890;
const formattedNumber = ref(formatNumber(largeNumber));

// 枚举示例
const httpStatusOk = HttpStatus.OK;
const businessSuccess = BusinessStatus.SUCCESS;

// 模拟API响应
const apiResponse = ref({
  code: BusinessStatus.SUCCESS,
  message: '操作成功',
  data: { name: '示例数据' },
  success: true,
  timestamp: Date.now()
});
</script>

<template>
  <div class="shared-demo">
    <h1>共享包使用示例</h1>
    
    <section>
      <h2>日期工具函数</h2>
      <p>当前日期: {{ currentDate }}</p>
      <p>格式化日期: {{ formattedDate }}</p>
      <p>相对时间: {{ relativeTime }}</p>
    </section>
    
    <section>
      <h2>字符串工具函数</h2>
      <p>原始文本: {{ longText }}</p>
      <p>截断文本: {{ truncatedText }}</p>
    </section>
    
    <section>
      <h2>数字格式化</h2>
      <p>原始数字: {{ largeNumber }}</p>
      <p>格式化数字: {{ formattedNumber }}</p>
    </section>
    
    <section>
      <h2>枚举使用</h2>
      <p>HTTP状态码 (OK): {{ httpStatusOk }}</p>
      <p>业务状态码 (SUCCESS): {{ businessSuccess }}</p>
    </section>
    
    <section>
      <h2>API响应示例</h2>
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      <p>业务状态: {{ apiResponse.code === BusinessStatus.SUCCESS ? '成功' : '失败' }}</p>
    </section>
  </div>
</template>

<style scoped>
.shared-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

h1 {
  color: #333;
  text-align: center;
}

h2 {
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}
</style> 
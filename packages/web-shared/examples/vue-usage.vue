<template>
  <div class="example-container">
    <h1>Web Shared Vue Example</h1>
    
    <section>
      <h2>Constants</h2>
      <div>Active Status: {{ StatusEnum.ACTIVE }}</div>
      <div>Blog Type: {{ ArticleTypeEnum.BLOG }}</div>
    </section>
    
    <section>
      <h2>Utility Functions</h2>
      <div>Formatted Date: {{ formattedDate }}</div>
      <div>Truncated Text: {{ truncatedText }}</div>
    </section>
    
    <section>
      <h2>Hooks</h2>
      <div>
        <div>Local Storage Value: {{ storedValue }}</div>
        <VueComponents.Button 
          @click="updateStorageValue"
        >
          Update Storage Value
        </VueComponents.Button>
      </div>
      <div>Is Mobile: {{ isMobile ? 'Yes' : 'No' }}</div>
      <div>
        <VueComponents.Button 
          @click="fetchData"
          :loading="loading"
        >
          Fetch Data
        </VueComponents.Button>
        <div v-if="data">Result: {{ data.message }}</div>
        <VueComponents.Alert 
          v-if="error"
          type="error" 
          :message="error.message"
        />
      </div>
    </section>
    
    <section>
      <h2>Components</h2>
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <VueComponents.Icon name="home" :size="24" />
        <VueComponents.Icon name="search" :size="24" />
        <VueComponents.Icon name="user" :size="24" />
      </div>
      
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <VueComponents.Button>Default</VueComponents.Button>
        <VueComponents.Button variant="success">Success</VueComponents.Button>
        <VueComponents.Button variant="warning">Warning</VueComponents.Button>
        <VueComponents.Button variant="danger">Danger</VueComponents.Button>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <VueComponents.Alert
          type="info"
          title="Information"
          message="This is an information message."
          :showIcon="true"
        />
        <VueComponents.Alert
          type="success"
          message="Operation completed successfully!"
          :showIcon="true"
        />
        <VueComponents.Alert
          type="warning"
          message="Warning: This action cannot be undone."
          :showIcon="true"
        />
        <VueComponents.Alert
          type="error"
          message="Error: Something went wrong."
          :showIcon="true"
          :closable="true"
          @close="handleAlertClose"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  // 常量
  StatusEnum,
  ArticleTypeEnum,
  
  // 工具函数
  formatDate,
  truncateText,
  
  // Vue特定的钩子和组件
  VueHooks,
  VueComponents
} from 'web-shared';

// 使用工具函数
const formattedDate = computed(() => formatDate(new Date(), 'YYYY-MM-DD HH:mm'));
const truncatedText = computed(() => truncateText('This is a very long text that should be truncated', 20));

// 使用Vue钩子
const [storedValue, setStoredValue] = VueHooks.useLocalStorage('example-key', 'Hello Web Shared!');
const isMobile = VueHooks.useMediaQuery('(max-width: 768px)');

// 更新存储值
function updateStorageValue() {
  setStoredValue('Updated Value ' + new Date().toISOString());
}

// 异步请求示例
const fetchDataFn = async () => {
  return { message: 'Data fetched successfully', success: true };
};

const [fetchData, loading, data, error] = VueHooks.useAsync(fetchDataFn);

// 警告关闭处理
function handleAlertClose() {
  console.log('Alert closed');
}
</script>

<style scoped>
.example-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

section {
  margin-bottom: 30px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style> 
# HTTP工具示例

:::tip
本页面提供HTTP工具函数的交互式示例，方便直观了解各种函数的使用效果。
:::

## URL参数处理

<script setup>
import { ref, watch } from 'vue';
import { parseUrlParams, buildUrl } from 'web-shared';

// URL解析示例
const inputUrl = ref('https://example.com/api?name=张三&age=25&active=true');
const parsedParams = ref({});

// URL构建示例
const baseUrl = ref('https://example.com/api');
const nameParam = ref('张三');
const ageParam = ref(25);
const activeParam = ref(true);
const builtUrl = ref('');

// 监听变量变化，更新结果
watch(inputUrl, () => {
  try {
    parsedParams.value = parseUrlParams(inputUrl.value);
  } catch(e) {
    parsedParams.value = { error: '无效的URL' };
  }
}, { immediate: true });

watch([baseUrl, nameParam, ageParam, activeParam], () => {
  try {
    const params = {
      name: nameParam.value,
      age: parseInt(ageParam.value) || 0,
      active: activeParam.value
    };
    builtUrl.value = buildUrl(baseUrl.value, params);
  } catch(e) {
    builtUrl.value = '构建URL出错';
  }
}, { immediate: true });
</script>

### parseUrlParams 函数

`parseUrlParams` 函数将URL字符串中的查询参数解析为对象。

```typescript
import { parseUrlParams } from 'web-shared';

// 解析URL参数
const url = 'https://example.com/api?name=张三&age=25&active=true';
const params = parseUrlParams(url);
console.log(params); // 输出: { name: '张三', age: '25', active: 'true' }
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>输入URL:</label>
    <input v-model="inputUrl" type="text">
  </div>
  
  <div class="form-group">
    <label>解析结果:</label>
    <pre class="result">{{ JSON.stringify(parsedParams, null, 2) }}</pre>
  </div>
  
  <div class="predefined-values">
    <button @click="inputUrl = 'https://example.com/api?name=张三&age=25&active=true'">示例1</button>
    <button @click="inputUrl = 'name=产品&category=电子&price=1999'">示例2</button>
    <button @click="inputUrl = 'https://api.example.com/search?q=手机&page=1&limit=20'">示例3</button>
  </div>
</div>

### buildUrl 函数

`buildUrl` 函数根据基础URL和参数对象构建完整的URL。

```typescript
import { buildUrl } from 'web-shared';

// 构建URL
const baseUrl = 'https://example.com/api';
const params = { name: '张三', age: 25, active: true };
const url = buildUrl(baseUrl, params);
console.log(url); // 输出: 'https://example.com/api?name=%E5%BC%A0%E4%B8%89&age=25&active=true'
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>基础URL:</label>
    <input v-model="baseUrl" type="text">
  </div>
  
  <div class="params-group">
    <h4>参数:</h4>
    <div class="param-item">
      <label>name:</label>
      <input v-model="nameParam" type="text">
    </div>
    <div class="param-item">
      <label>age:</label>
      <input v-model="ageParam" type="number">
    </div>
    <div class="param-item">
      <label>active:</label>
      <input v-model="activeParam" type="checkbox">
    </div>
  </div>
  
  <div class="form-group">
    <label>构建结果:</label>
    <pre class="result">{{ builtUrl }}</pre>
  </div>
</div>

<style>
.example-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.result {
  padding: 8px 12px;
  background-color: #e2f2ff;
  border-radius: 4px;
  font-weight: 500;
  color: #0c5460;
  word-break: break-all;
  white-space: pre-wrap;
  overflow-x: auto;
}

.predefined-values {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.predefined-values button {
  padding: 4px 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.predefined-values button:hover {
  background-color: #e0e0e0;
}

.params-group {
  margin-bottom: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px;
}

.params-group h4 {
  margin-top: 0;
  margin-bottom: 12px;
}

.param-item {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.param-item label {
  width: 60px;
  margin-right: 10px;
  font-weight: bold;
}

.param-item input[type="text"],
.param-item input[type="number"] {
  flex: 1;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style> 
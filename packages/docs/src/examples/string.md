# 字符串工具示例

:::tip
本页面提供字符串工具函数的交互式示例，方便直观了解各种函数的使用效果。
:::

## 文本截断

<script setup>
import { ref, watch } from 'vue';
import { truncate, formatNumber } from 'web-shared';

// 文本截断示例
const originalText = ref('这是一段很长的文本，将被截断并添加省略号，你可以尝试调整下方的最大长度参数。');
const maxLength = ref(10);
const truncatedText = ref('');

// 数字格式化示例
const originalNumber = ref(1234567.89);
const formattedNumberText = ref('');

// 监听变量变化，更新结果
watch([originalText, maxLength], () => {
  truncatedText.value = truncate(originalText.value, maxLength.value);
}, { immediate: true });

watch(originalNumber, () => {
  formattedNumberText.value = formatNumber(originalNumber.value);
}, { immediate: true });
</script>

### truncate 函数

`truncate` 函数将文本截断到指定长度，并在末尾添加省略号。

```typescript
import { truncate } from 'web-shared';

// 截断文本
const text = '这是一段很长的文本';
const shortened = truncate(text, 5);
console.log(shortened); // 输出：这是一段...
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>原始文本:</label>
    <textarea v-model="originalText" rows="3"></textarea>
  </div>
  
  <div class="form-group">
    <label>最大长度:</label>
    <input type="range" v-model="maxLength" min="1" max="50" step="1">
    <span class="range-value">{{ maxLength }}</span>
  </div>
  
  <div class="form-group">
    <label>截断结果:</label>
    <div class="result">{{ truncatedText }}</div>
  </div>
  
  <div class="info">
    <p>原始文本长度: {{ originalText.length }} 字符</p>
    <p>截断后文本长度: {{ truncatedText.length }} 字符</p>
  </div>
</div>

## 数字格式化

### formatNumber 函数

`formatNumber` 函数将数字格式化为带千分位的字符串。

```typescript
import { formatNumber } from 'web-shared';

// 格式化数字
const num = 1234567.89;
const formatted = formatNumber(num);
console.log(formatted); // 输出：1,234,567.89
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>输入数字:</label>
    <input type="number" v-model="originalNumber">
  </div>
  
  <div class="form-group">
    <label>格式化结果:</label>
    <div class="result">{{ formattedNumberText }}</div>
  </div>
  
  <div class="predefined-values">
    <button @click="originalNumber = 1000">1000</button>
    <button @click="originalNumber = 10000">10,000</button>
    <button @click="originalNumber = 1000000">1,000,000</button>
    <button @click="originalNumber = 1234567.89">1,234,567.89</button>
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

.form-group textarea,
.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-group input[type="range"] {
  width: 80%;
  vertical-align: middle;
}

.range-value {
  display: inline-block;
  margin-left: 10px;
  min-width: 30px;
  font-weight: bold;
}

.result {
  padding: 8px 12px;
  background-color: #e2f2ff;
  border-radius: 4px;
  font-weight: 500;
  color: #0c5460;
  word-break: break-all;
}

.info {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
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
</style> 
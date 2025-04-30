# 日期工具示例

:::tip
本页面提供日期工具函数的交互式示例，方便直观了解各种函数的使用效果。
:::

## 日期格式化

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate, getRelativeTime } from 'web-shared';

// 日期格式化示例
const currentDate = ref(new Date());
const formattedDate = ref('');
const dateFormat = ref('YYYY-MM-DD HH:mm:ss');

// 相对时间示例
const pastDate = ref(new Date(Date.now() - 5 * 60 * 1000)); // 5分钟前
const relativeDateString = ref('');
const minutesAgo = ref(5);

// 格式化日期函数
function updateFormattedDate() {
  formattedDate.value = formatDate(currentDate.value, dateFormat.value);
}

// 更新相对时间
function updateRelativeTime() {
  const timestamp = Date.now() - (minutesAgo.value * 60 * 1000);
  pastDate.value = new Date(timestamp);
  relativeDateString.value = getRelativeTime(pastDate.value);
}

// 组件挂载后初始化
onMounted(() => {
  updateFormattedDate();
  updateRelativeTime();
  
  // 每秒更新一次相对时间
  setInterval(() => {
    relativeDateString.value = getRelativeTime(pastDate.value);
  }, 1000);
});
</script>

### formatDate 函数

`formatDate` 函数将日期对象格式化为指定格式的字符串。

```typescript
import { formatDate } from 'web-shared';

// 格式化日期
const date = new Date();
const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
console.log(formatted); // 例如：2025-04-30 10:30:45
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>当前日期时间:</label>
    <div>{{ currentDate.toLocaleString() }}</div>
  </div>
  
  <div class="form-group">
    <label>格式模板:</label>
    <select v-model="dateFormat" @change="updateFormattedDate">
      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
      <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
      <option value="YYYY/MM/DD">YYYY/MM/DD</option>
      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
      <option value="YYYY年MM月DD日">YYYY年MM月DD日</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>格式化结果:</label>
    <div class="result">{{ formattedDate }}</div>
  </div>
</div>

## 相对时间

### getRelativeTime 函数

`getRelativeTime` 函数计算指定日期与当前时间的相对差值，并以易读的形式表示。

```typescript
import { getRelativeTime } from 'web-shared';

// 获取相对时间
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
const relativeTime = getRelativeTime(fiveMinutesAgo);
console.log(relativeTime); // 输出：5分钟前
```

#### 交互示例

<div class="example-box">
  <div class="form-group">
    <label>选择时间范围:</label>
    <select v-model="minutesAgo" @change="updateRelativeTime">
      <option :value="0.5">30秒前</option>
      <option :value="5">5分钟前</option>
      <option :value="30">30分钟前</option>
      <option :value="60">1小时前</option>
      <option :value="180">3小时前</option>
      <option :value="1440">1天前</option>
      <option :value="4320">3天前</option>
      <option :value="43200">30天前</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>实际日期时间:</label>
    <div>{{ pastDate.toLocaleString() }}</div>
  </div>
  
  <div class="form-group">
    <label>相对时间描述:</label>
    <div class="result">{{ relativeDateString }}</div>
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

.form-group select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
}

.result {
  padding: 8px 12px;
  background-color: #e2f2ff;
  border-radius: 4px;
  font-weight: 500;
  color: #0c5460;
}
</style> 
# 基础示例

:::tip
这里展示了共享包的一些基本用法示例。您可以通过左侧导航查看更多详细示例。
:::

## 快速入门

以下是一些使用共享包的简单示例：

### 导入工具函数

```typescript
// 导入工具函数
import { formatDate, truncate } from 'web-shared';

// 日期格式化
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD');
console.log(formattedDate); // 例如：2025-04-30

// 文本截断
const truncatedText = truncate('这是一段很长的文本', 5);
console.log(truncatedText); // 输出：这是一段...
```

### 使用枚举

```typescript
import { HttpStatus, BusinessStatus } from 'web-shared';

// 使用HTTP状态码
if (response.status === HttpStatus.OK) {
  console.log('请求成功');
}

// 使用业务状态码
if (result.code === BusinessStatus.SUCCESS) {
  console.log('操作成功');
}
```

### 使用类型定义

```typescript
import { ApiResponse, PaginationParams } from 'web-shared';

// 定义API响应类型
type UserResponse = ApiResponse<{
  id: number;
  name: string;
  email: string;
}>;

// 使用分页参数
const params: PaginationParams = {
  page: 1,
  pageSize: 10
};
```

## 更多示例

- [日期工具示例](./date.md) - 日期格式化和相对时间
- [字符串工具示例](./string.md) - 文本截断和数字格式化
- [HTTP工具示例](./http.md) - URL参数处理 
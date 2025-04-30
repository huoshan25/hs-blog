# 工具函数

共享包提供了多种工具函数，按功能分类。每个函数都有TypeScript类型定义和详细的JSDoc注释。

## 日期工具

### formatDate

格式化日期为指定的格式字符串。

**语法**

```typescript
function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD'): string
```

**参数**

- `date` - 要格式化的日期对象、时间戳或日期字符串
- `format` - 格式模板，默认为 'YYYY-MM-DD'

**格式占位符**

- `YYYY` - 四位年份，如 2025
- `MM` - 两位月份，如 04
- `DD` - 两位日期，如 30
- `HH` - 两位小时（24小时制），如 14
- `mm` - 两位分钟，如 05
- `ss` - 两位秒数，如 30

**示例**

```typescript
import { formatDate } from 'web-shared';

// 格式化当前日期
formatDate(new Date()); // 输出: '2025-04-30'

// 自定义格式
formatDate(new Date(), 'YYYY/MM/DD HH:mm'); // 输出: '2025/04/30 14:30'

// 格式化时间戳
formatDate(1620000000000, 'YYYY-MM-DD'); // 输出: '2021-05-03'
```

### getRelativeTime

获取相对时间描述，如"刚刚"、"5分钟前"等。

**语法**

```typescript
function getRelativeTime(date: Date | number | string): string
```

**参数**

- `date` - 要计算相对时间的日期对象、时间戳或日期字符串

**返回值**

返回一个字符串，表示相对于当前时间的描述，如：
- 刚刚（不到1分钟）
- X分钟前（小于1小时）
- X小时前（小于24小时）
- X天前（小于30天）
- 超过30天则返回格式化的日期（YYYY-MM-DD）

**示例**

```typescript
import { getRelativeTime } from 'web-shared';

// 几分钟前
getRelativeTime(new Date(Date.now() - 5 * 60 * 1000)); // 输出: '5分钟前'

// 几小时前
getRelativeTime(new Date(Date.now() - 3 * 60 * 60 * 1000)); // 输出: '3小时前'

// 很久以前
getRelativeTime(new Date('2023-01-01')); // 输出: '2023-01-01'
```

## 字符串工具

### truncate

截断文本，超出长度添加省略号。

**语法**

```typescript
function truncate(text: string, maxLength: number): string
```

**参数**

- `text` - 原始文本
- `maxLength` - 最大长度

**示例**

```typescript
import { truncate } from 'web-shared';

truncate('这是一段很长的文本', 5); // 输出: '这是一段...'
truncate('短文本', 10); // 输出: '短文本'（未超过长度，不截断）
```

### formatNumber

格式化数字为带千分位的字符串。

**语法**

```typescript
function formatNumber(num: number): string
```

**参数**

- `num` - 要格式化的数字

**示例**

```typescript
import { formatNumber } from 'web-shared';

formatNumber(1234567); // 输出: '1,234,567'
formatNumber(1000); // 输出: '1,000'
```

## HTTP工具

### parseUrlParams

解析URL参数为对象。

**语法**

```typescript
function parseUrlParams(url: string): Record<string, string>
```

**参数**

- `url` - URL字符串或查询字符串

**示例**

```typescript
import { parseUrlParams } from 'web-shared';

// 完整URL
parseUrlParams('https://example.com/path?name=张三&age=25');
// 输出: { name: '张三', age: '25' }

// 仅查询字符串
parseUrlParams('name=张三&age=25');
// 输出: { name: '张三', age: '25' }
```

### buildUrl

构建带参数的URL。

**语法**

```typescript
function buildUrl(baseUrl: string, params: Record<string, string | number | boolean>): string
```

**参数**

- `baseUrl` - 基础URL
- `params` - 参数对象

**示例**

```typescript
import { buildUrl } from 'web-shared';

buildUrl('https://example.com/api', { 
  name: '张三', 
  age: 25, 
  active: true 
});
// 输出: 'https://example.com/api?name=%E5%BC%A0%E4%B8%89&age=25&active=true'
``` 
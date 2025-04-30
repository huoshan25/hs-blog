# 安装和使用

## 在Monorepo内部使用

在monorepo项目中，直接在应用的`package.json`文件中添加对`web-shared`包的依赖即可：

```json
{
  "dependencies": {
    "web-shared": "workspace:*"
  }
}
```

然后运行安装命令：

```bash
pnpm install
```

## 在外部项目中使用

如果你想在外部项目中使用此包，需要先发布到npm或私有仓库：

```bash
# 使用npm安装
npm install @your-org/web-shared

# 或使用yarn
yarn add @your-org/web-shared

# 或使用pnpm
pnpm add @your-org/web-shared
```

## 基本用法

### 导入特定函数

```typescript
// 导入特定函数
import { formatDate, truncate } from 'web-shared';

// 使用日期格式化函数
const today = new Date();
const formattedDate = formatDate(today, 'YYYY-MM-DD HH:mm:ss');
console.log(formattedDate); // 例如：2025-04-30 10:30:45

// 使用文本截断函数
const text = '这是一段很长的文本，将被截断并添加省略号';
const truncatedText = truncate(text, 10);
console.log(truncatedText); // 这是一段很长的...
```

### 使用枚举

```typescript
import { HttpStatus, BusinessStatus } from 'web-shared';

// 使用HTTP状态码
function handleResponse(statusCode: number) {
  if (statusCode === HttpStatus.OK) {
    console.log('请求成功');
  } else if (statusCode === HttpStatus.NOT_FOUND) {
    console.log('资源未找到');
  } else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
    console.log('服务器错误');
  }
}

// 使用业务状态码
function handleBusinessResponse(code: number) {
  if (code === BusinessStatus.SUCCESS) {
    console.log('业务处理成功');
  } else if (code === BusinessStatus.USER_NOT_FOUND) {
    console.log('用户未找到');
  }
}
```

### 使用类型定义

```typescript
import { ApiResponse, PaginationParams, PaginationResult } from 'web-shared';

// 定义API请求函数
async function fetchUsers(params: PaginationParams): Promise<ApiResponse<PaginationResult<User>>> {
  const response = await fetch(`/api/users?page=${params.page}&pageSize=${params.pageSize}`);
  return response.json();
}

// 使用API
const result = await fetchUsers({ page: 1, pageSize: 10 });
if (result.success) {
  const { list, total } = result.data;
  console.log(`共 ${total} 条记录，当前显示 ${list.length} 条`);
}
```

## 模块导入

除了按需导入特定函数外，你还可以导入整个模块：

```typescript
// 导入所有工具函数
import * as Utils from 'web-shared';

// 使用函数
const date = Utils.formatDate(new Date(), 'YYYY-MM-DD');
const text = Utils.truncate('长文本', 5);

// 使用枚举
if (statusCode === Utils.HttpStatus.OK) {
  // 处理成功响应
}
```

## TypeScript支持

`web-shared`包提供完整的TypeScript类型定义，支持编辑器的代码补全和类型检查功能。 
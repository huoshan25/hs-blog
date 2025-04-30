# Web共享工具库

这个包包含前端项目常用的工具函数、枚举、类型定义等，便于在多个项目间共享代码。

## 安装

### 项目内部使用（Monorepo内）

在monorepo项目中，你可以直接在其他应用中引用这个包：

```json
{
  "dependencies": {
    "web-shared": "*"
  }
}
```

### 外部项目使用

你可以将这个包发布到npm或私有仓库：

```bash
# 安装
npm install @your-org/web-shared

# 或使用yarn
yarn add @your-org/web-shared

# 或使用pnpm
pnpm add @your-org/web-shared
```

## 使用示例

### 导入工具函数

```typescript
// 导入特定函数
import { formatDate, truncate } from 'web-shared';

// 使用示例
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD HH:mm');
const truncatedText = truncate('这是一段很长的文本', 10);
```

### 使用枚举

```typescript
import { HttpStatus, BusinessStatus } from 'web-shared';

// 使用示例
if (response.status === HttpStatus.OK) {
  // 处理成功响应
}

if (result.code === BusinessStatus.USER_NOT_FOUND) {
  // 处理用户未找到的情况
}
```

### 使用类型

```typescript
import { ApiResponse, PaginationParams, TreeNode } from 'web-shared';

// 使用示例
function fetchUsers(params: PaginationParams): Promise<ApiResponse<User[]>> {
  // 实现获取用户列表的逻辑
}

const treeData: TreeNode[] = [
  {
    id: 1,
    label: '节点1',
    children: [
      { id: 2, label: '节点1-1' }
    ]
  }
];
```

## API文档

### 工具函数

#### 日期工具

- `formatDate(date, format)`: 格式化日期
- `getRelativeTime(date)`: 获取相对时间描述

#### 字符串工具

- `truncate(text, maxLength)`: 截断文本并添加省略号
- `formatNumber(num)`: 格式化数字为千分位形式

#### HTTP工具

- `parseUrlParams(url)`: 解析URL参数为对象
- `buildUrl(baseUrl, params)`: 构建带参数的URL

### 枚举

#### HttpStatus

HTTP状态码枚举，包含常见的HTTP响应状态码。

#### BusinessStatus

业务状态码枚举，用于标识不同的业务操作结果。

### 类型定义

- `PaginationParams`: 分页请求参数
- `PaginationResult<T>`: 分页响应结构
- `ApiResponse<T>`: API响应基础结构
- `BaseItem`: 列表项的基础接口
- `TreeNode<T>`: 树形数据节点

## 开发

### 在包目录内开发

```bash
# 进入包目录
cd packages/web-shared

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

### 从根目录开发

```bash
# 在根目录运行开发模式
pnpm dev:shared

# 构建共享包
pnpm build:shared

# 构建所有项目（包括共享包）
pnpm build:all

# 清理项目
pnpm clean
```
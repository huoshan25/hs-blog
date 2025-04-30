# 类型定义

共享包提供了一系列通用的TypeScript类型定义，帮助统一项目中的数据结构和接口定义。

## 基础类型

### PaginationParams

分页请求参数接口，用于请求分页数据。

```typescript
interface PaginationParams {
  page: number;
  pageSize: number;
}
```

- `page` - 当前页码，从1开始
- `pageSize` - 每页条数

### PaginationResult

分页响应结构接口，包含分页数据和分页信息。

```typescript
interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

- `list` - 当前页的数据列表
- `total` - 总记录数
- `page` - 当前页码
- `pageSize` - 每页条数
- `totalPages` - 总页数

### ApiResponse

API响应基础结构接口，统一API返回格式。

```typescript
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}
```

- `code` - 业务状态码，通常使用`BusinessStatus`枚举
- `message` - 响应消息
- `data` - 响应数据，泛型参数
- `success` - 是否成功
- `timestamp` - 响应时间戳

### BaseItem

列表项的基础接口，常用于实体类的基础结构。

```typescript
interface BaseItem {
  id: string | number;
  name?: string;
  createTime?: string | number | Date;
  updateTime?: string | number | Date;
}
```

- `id` - 唯一标识符
- `name` - 名称（可选）
- `createTime` - 创建时间（可选）
- `updateTime` - 更新时间（可选）

### TreeNode

树形数据节点接口，用于构建树形结构数据。

```typescript
interface TreeNode<T = any> {
  id: string | number;
  label: string;
  children?: TreeNode<T>[];
  parentId?: string | number | null;
  [key: string]: any;
}
```

- `id` - 节点ID
- `label` - 节点标签
- `children` - 子节点数组（可选）
- `parentId` - 父节点ID（可选）
- 支持任意其他属性

## 使用示例

### 分页请求和响应

```typescript
import { PaginationParams, PaginationResult, ApiResponse } from 'web-shared';

// 用户类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 请求用户列表
async function fetchUsers(params: PaginationParams): Promise<PaginationResult<User>> {
  const url = `/api/users?page=${params.page}&pageSize=${params.pageSize}`;
  const response = await fetch(url);
  const result: ApiResponse<PaginationResult<User>> = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}

// 使用例子
async function loadUserList() {
  try {
    const params: PaginationParams = { page: 1, pageSize: 10 };
    const result = await fetchUsers(params);
    
    console.log(`共 ${result.total} 条记录`);
    console.log(`当前第 ${result.page}/${result.totalPages} 页`);
    
    // 处理用户列表
    result.list.forEach(user => {
      console.log(`用户: ${user.name}, 邮箱: ${user.email}`);
    });
  } catch (error) {
    console.error('加载用户列表失败:', error);
  }
}
```

### 树形结构

```typescript
import { TreeNode } from 'web-shared';

// 定义菜单项
interface MenuItem extends TreeNode {
  path: string;
  icon?: string;
  hidden?: boolean;
}

// 菜单树
const menuTree: MenuItem[] = [
  {
    id: 1,
    label: '仪表盘',
    path: '/dashboard',
    icon: 'dashboard',
    children: []
  },
  {
    id: 2,
    label: '用户管理',
    path: '/users',
    icon: 'user',
    children: [
      {
        id: 21,
        label: '用户列表',
        path: '/users/list',
        parentId: 2
      },
      {
        id: 22,
        label: '用户组',
        path: '/users/groups',
        parentId: 2
      }
    ]
  }
];

// 树形数据处理函数示例
function findNodeById(tree: TreeNode[], id: number | string): TreeNode | null {
  for (const node of tree) {
    if (node.id === id) {
      return node;
    }
    
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}

// 使用示例
const userListNode = findNodeById(menuTree, 21);
console.log(userListNode); // { id: 21, label: '用户列表', path: '/users/list', parentId: 2 }
```

### 扩展已有类型

```typescript
import { BaseItem, ApiResponse } from 'web-shared';

// 扩展基础项目类型
interface Article extends BaseItem {
  title: string;
  content: string;
  author: string;
  tags: string[];
  viewCount: number;
}

// 定义文章详情响应
type ArticleDetailResponse = ApiResponse<Article>;

// 使用示例
async function getArticle(id: number): Promise<Article> {
  const response = await fetch(`/api/articles/${id}`);
  const result: ArticleDetailResponse = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
``` 
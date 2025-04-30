# 枚举

共享包提供了一系列常用枚举，方便在项目中统一使用各种状态码和常量值。

## HttpStatus

HTTP状态码枚举，包含常见的HTTP响应状态码。

```typescript
import { HttpStatus } from 'web-shared';

// 使用示例
if (response.status === HttpStatus.OK) {
  // 请求成功，处理响应数据
}
```

| 枚举名称 | 值 | 描述 |
|---------|------|------|
| **成功响应** | | |
| `OK` | 200 | 请求成功 |
| `CREATED` | 201 | 资源创建成功 |
| `ACCEPTED` | 202 | 请求已接受，但尚未处理完成 |
| `NO_CONTENT` | 204 | 请求成功，但没有内容返回 |
| **客户端错误** | | |
| `BAD_REQUEST` | 400 | 无效请求 |
| `UNAUTHORIZED` | 401 | 未授权，需要身份验证 |
| `FORBIDDEN` | 403 | 已认证但没有权限访问 |
| `NOT_FOUND` | 404 | 资源未找到 |
| `METHOD_NOT_ALLOWED` | 405 | 不允许的HTTP方法 |
| `CONFLICT` | 409 | 请求冲突 |
| **服务器错误** | | |
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 |
| `NOT_IMPLEMENTED` | 501 | 服务器不支持该功能 |
| `BAD_GATEWAY` | 502 | 网关错误 |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 |

## BusinessStatus

业务状态码枚举，用于标识不同的业务操作结果。

```typescript
import { BusinessStatus } from 'web-shared';

// 使用示例
if (result.code === BusinessStatus.SUCCESS) {
  // 业务操作成功
} else if (result.code === BusinessStatus.USER_NOT_FOUND) {
  // 用户未找到
}
```

| 枚举名称 | 值 | 描述 |
|---------|------|------|
| **通用状态** | | |
| `SUCCESS` | 0 | 操作成功 |
| `FAILED` | -1 | 操作失败 |
| **用户相关** | | |
| `USER_NOT_FOUND` | 1001 | 用户未找到 |
| `USER_ALREADY_EXISTS` | 1002 | 用户已存在 |
| `PASSWORD_ERROR` | 1003 | 密码错误 |
| `TOKEN_EXPIRED` | 1004 | 令牌过期 |
| `TOKEN_INVALID` | 1005 | 无效的令牌 |
| **数据相关** | | |
| `DATA_NOT_FOUND` | 2001 | 数据未找到 |
| `DATA_ALREADY_EXISTS` | 2002 | 数据已存在 |
| `DATA_VALIDATION_FAILED` | 2003 | 数据验证失败 |
| **系统相关** | | |
| `SYSTEM_ERROR` | 9001 | 系统错误 |
| `NETWORK_ERROR` | 9002 | 网络错误 |
| `DATABASE_ERROR` | 9003 | 数据库错误 |

## 使用示例

### 在HTTP请求中使用

```typescript
import { HttpStatus, BusinessStatus } from 'web-shared';

async function fetchData() {
  const response = await fetch('/api/data');
  
  if (response.status === HttpStatus.OK) {
    const data = await response.json();
    
    if (data.code === BusinessStatus.SUCCESS) {
      return data.data;
    } else {
      throw new Error(`业务错误: ${data.message}`);
    }
  } else if (response.status === HttpStatus.UNAUTHORIZED) {
    // 跳转到登录页面
    location.href = '/login';
  } else {
    throw new Error(`HTTP错误: ${response.status}`);
  }
}
```

### 在API响应处理中使用

```typescript
import { BusinessStatus, ApiResponse } from 'web-shared';

function handleApiResponse<T>(response: ApiResponse<T>): T {
  switch (response.code) {
    case BusinessStatus.SUCCESS:
      return response.data;
      
    case BusinessStatus.TOKEN_EXPIRED:
    case BusinessStatus.TOKEN_INVALID:
      // 处理登录过期
      alert('登录已过期，请重新登录');
      location.href = '/login';
      break;
      
    case BusinessStatus.USER_NOT_FOUND:
      alert('用户不存在');
      break;
      
    default:
      alert(`操作失败: ${response.message}`);
  }
  
  throw new Error(response.message);
}
``` 
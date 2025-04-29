# hs-blog

一个完整的博客系统，包含博客门户、博客前台、管理后台和API服务。

## 项目结构

这是一个基于pnpm workspaces的monorepo项目，包含以下组件：

- **博客前台** (`apps/hs-blog-portal`): 基于Next.js的博客门户展示界面
- **博客前台** (`apps/hs-blog-web`): 基于Nuxt.js的博客展示界面
- **管理后台** (`apps/hs-blog-admin`): 基于Vue.js的博客管理界面
- **API服务** (`apps/hs-blog-server`): 基于Nest.js的后端API服务
- **共享组件** (`packages/web-shared`): 前端共享代码库

## 开发环境

### 前置要求

- Node.js v20+
- pnpm v8+

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 开发命令

```bash
# 开发所有项目
pnpm dev

# 开发博客门户
pnpm dev:blog-portal

# 开发博客前台
pnpm dev:blog-web

# 开发管理后台
pnpm dev:blog-admin 

# 开发博客API
pnpm dev:blog-server
```

## 项目特性

- 基于monorepo架构，便于代码共享和统一管理
- 现代化的前端开发体验
- 响应式设计，适配各种设备

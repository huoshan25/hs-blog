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
- Docker & Docker Compose (可选)

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 开发命令

```bash
# 统一运行
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

## 使用Docker开发

项目提供了完整的Docker支持，可以使用Docker进行开发和部署。

### 使用Docker Compose启动所有服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看容器日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

### 单独构建某个服务

```bash
# 构建博客前台
docker build -t hs-blog-web -f apps/hs-blog-web/Dockerfile .

# 构建门户网站
docker build -t hs-blog-portal -f apps/hs-blog-portal/Dockerfile .

# 构建管理后台
docker build -t hs-blog-admin -f apps/hs-blog-admin/Dockerfile .

# 构建API服务
docker build -t hs-blog-server -f apps/hs-blog-server/Dockerfile .
```

## 生产环境部署

本项目使用GitHub Actions和Docker进行自动化部署。关于部署的详细信息，请参考：

- [部署指南](./docs/deployment-guide.md)

### 手动部署

1. 复制并配置环境变量
   ```bash
   cp .env.example .env.production
   # 编辑.env.production文件填写必要信息
   ```

2. 构建和启动容器
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## 项目特性

- 基于monorepo架构，便于代码共享和统一管理
- 现代化的前端开发体验
- 完整的Docker容器化部署
- CI/CD自动化流程
- 响应式设计，适配各种设备

## 贡献指南

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

ISC

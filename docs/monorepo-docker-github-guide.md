# Monorepo + Docker + GitHub Actions 完整指南

本文档详细介绍了如何使用Monorepo架构结合Docker和GitHub Actions来构建、部署和维护一个完整的博客系统。

## 目录

- [项目概述](#项目概述)
- [Monorepo架构](#monorepo架构)
- [Docker容器化](#docker容器化)
- [CI/CD自动化](#cicd自动化)
- [开发流程](#开发流程)
- [部署流程](#部署流程)
- [最佳实践](#最佳实践)
- [常见问题解答](#常见问题解答)

## 项目概述

本项目是一个完整的博客系统，采用Monorepo架构组织代码，包含以下组件：

- **博客门户** (`apps/hs-blog-portal`): 基于Next.js的博客门户展示界面
- **博客前台** (`apps/hs-blog-web`): 基于Nuxt.js的博客展示界面
- **管理后台** (`apps/hs-blog-admin`): 基于Vue.js的博客管理界面
- **API服务** (`apps/hs-blog-server`): 基于Nest.js的后端API服务
- **共享组件** (`packages/web-shared`): 前端共享代码库

每个服务都通过Docker容器化进行管理，并使用GitHub Actions实现自动化构建和部署。

## Monorepo架构

### 什么是Monorepo？

Monorepo（单一代码仓库）是一种将多个相关项目存储在单个代码仓库中的软件开发策略。这种方式的主要优势在于：

- **代码共享与复用**：轻松在项目间共享代码
- **原子提交**：对多个项目进行统一更改
- **简化依赖管理**：统一版本控制
- **项目协同**：更好的团队协作体验

### 项目结构

```
hs-blog/
├── apps/                     # 应用程序目录
│   ├── hs-blog-web/          # Nuxt.js博客前台
│   ├── hs-blog-portal/       # Next.js博客门户
│   ├── hs-blog-admin/        # Vue.js管理后台
│   └── hs-blog-server/       # Nest.js API服务
├── packages/                 # 共享包目录
│   └── web-shared/           # 前端共享库
├── .github/
│   └── workflows/            # GitHub Actions工作流配置
├── nginx/                    # Nginx配置文件
├── package.json              # 项目根配置
├── pnpm-workspace.yaml       # pnpm工作区配置
├── turbo.json                # Turborepo配置
├── docker-compose.yml        # Docker Compose配置
└── .env.example              # 环境变量示例
```

### 工作区配置

我们使用pnpm工作区(workspaces)来管理Monorepo:

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**package.json**中的核心脚本:
```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:blog-web": "pnpm --filter hs-blog-web dev",
    "dev:blog-admin": "pnpm --filter hs-blog-admin dev",
    "dev:blog-server": "pnpm --filter hs-blog-server dev",
    "dev:blog-portal": "pnpm --filter hs-blog-portal dev",
    "build:blog-web": "pnpm --filter hs-blog-web build",
    "build:blog-admin": "pnpm --filter hs-blog-admin build",
    "build:blog-server": "pnpm --filter hs-blog-server build",
    "build:blog-portal": "pnpm --filter hs-blog-portal build"
  }
}
```

### Turborepo加速构建

我们使用Turborepo来提高构建性能:

**turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Docker容器化

### Docker架构概述

每个应用都有自己的Dockerfile，并通过docker-compose.yml整合所有服务:

```
hs-blog/
├── apps/
│   ├── hs-blog-web/
│   │   └── Dockerfile        # 博客前台Dockerfile
│   ├── hs-blog-portal/
│   │   └── Dockerfile        # 博客门户Dockerfile
│   ├── hs-blog-admin/
│   │   └── Dockerfile        # 管理后台Dockerfile
│   └── hs-blog-server/
│       └── Dockerfile        # API服务Dockerfile
├── docker-compose.yml        # 组合所有服务
└── .dockerignore             # 排除无关文件
```

### Dockerfile示例 (博客前台)

```dockerfile
# 构建阶段
FROM node:18-alpine AS build

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制应用程序代码
COPY apps/hs-blog-web ./apps/hs-blog-web
COPY packages ./packages

# 安装依赖
RUN pnpm install

# 构建应用(SSR模式)
RUN cd apps/hs-blog-web && npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建好的应用
COPY --from=build /app/apps/hs-blog-web/.output ./.output
COPY --from=build /app/apps/hs-blog-web/package.json ./package.json

# 暴露Nuxt内部端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
```

### Docker Compose配置

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  blog-web:
    build:
      context: .
      dockerfile: apps/hs-blog-web/Dockerfile
    container_name: hs-blog-web
    restart: always
    ports:
      - "7788:3000"
    env_file:
      - .env.production
    volumes:
      - blog_web_data:/app/data
    networks:
      - hs-blog-network
    depends_on:
      - blog-server
    mem_limit: 256M

  blog-portal:
    build:
      context: .
      dockerfile: apps/hs-blog-portal/Dockerfile
    container_name: hs-blog-portal
    restart: always
    ports:
      - "7787:7787"
    env_file:
      - .env.production
    volumes:
      - blog_portal_data:/app/data
    networks:
      - hs-blog-network
    depends_on:
      - blog-server
    mem_limit: 256M

  blog-admin:
    build:
      context: .
      dockerfile: apps/hs-blog-admin/Dockerfile
    container_name: hs-blog-admin
    restart: always
    ports:
      - "7789:7789"
    networks:
      - hs-blog-network
    mem_limit: 128M

  blog-server:
    build:
      context: .
      dockerfile: apps/hs-blog-server/Dockerfile
    container_name: hs-blog-server
    restart: always
    ports:
      - "7790:7790"
    env_file:
      - .env.production
    volumes:
      - blog_server_data:/app/data
    networks:
      - hs-blog-network
    mem_limit: 512M

networks:
  hs-blog-network:
    driver: bridge

volumes:
  blog_web_data:
  blog_portal_data:
  blog_server_data:
```

### 容器间通信

各服务部署在同一Docker网络`hs-blog-network`中，可以通过容器名称互相访问:

- 从`blog-web`访问API: `http://blog-server:7790/api/...`
- 容器内部端口与暴露到主机的端口可以不同（如blog-web内部3000映射到主机7788）

## CI/CD自动化

### GitHub Actions概述

我们使用GitHub Actions工作流实现持续集成和持续部署:

```
.github/
└── workflows/
    ├── blog-web.yml          # 博客前台工作流
    ├── blog-portal.yml       # 博客门户工作流
    ├── blog-admin.yml        # 管理后台工作流
    ├── blog-server.yml       # API服务工作流
    └── build.yml             # 完整构建工作流
```

### 工作流触发策略

1. **单个应用工作流**：当修改特定应用代码时触发
2. **完整构建工作流**：可手动触发或修改关键配置文件时触发

### 单个应用工作流示例

**blog-web.yml**:
```yaml
name: 博客前台构建部署

on:
  push:
    branches: [main]
    paths:
      - 'apps/hs-blog-web/**'
      - 'packages/**'  # 共享包可能被依赖
  pull_request:
    branches: [main]
    paths:
      - 'apps/hs-blog-web/**'
      - 'packages/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      - name: 设置Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: 登录到Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 构建并推送Docker镜像
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./apps/hs-blog-web/Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-web:latest

      - name: 部署到服务器
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: 22
          script: |
            cd /www/wwwroot/hs-blog
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-web:latest
            docker-compose down blog-web
            docker-compose up -d blog-web
```

### 完整构建工作流

**build.yml** (简化版):
```yaml
name: 全部项目构建

on:
  workflow_dispatch:  # 手动触发
  push:
    branches: [main]
    paths:
      - 'package.json'
      - 'pnpm-workspace.yaml'
      - 'docker-compose.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      # [构建各服务镜像的步骤...]

      - name: 拷贝docker-compose和环境文件到服务器
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "docker-compose.yml,.env.production"
          target: "/www/wwwroot/hs-blog"

      - name: 部署到服务器
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /www/wwwroot/hs-blog
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-web:latest
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-portal:latest
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-admin:latest
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/hs-blog-server:latest
            docker-compose down
            docker-compose up -d
```

### GitHub Secrets配置

需要在GitHub仓库中配置以下Secrets:

- `DOCKERHUB_USERNAME`: Docker Hub用户名
- `DOCKERHUB_TOKEN`: Docker Hub访问令牌
- `REMOTE_HOST`: 部署服务器IP或域名
- `REMOTE_USER`: 服务器SSH用户名
- `SERVER_SSH_KEY`: 服务器SSH私钥

## 开发流程

### 本地开发环境设置

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/hs-blog.git
   cd hs-blog
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 创建环境变量文件
   ```bash
   cp .env.example .env.development
   # 编辑.env.development填写必要信息
   ```

4. 启动特定服务
   ```bash
   # 开发博客前台
   pnpm dev:blog-web
   
   # 开发管理后台
   pnpm dev:blog-admin
   
   # 开发API服务
   pnpm dev:blog-server
   
   # 开发博客门户
   pnpm dev:blog-portal
   ```

5. 同时启动所有服务
   ```bash
   pnpm dev
   ```

### 使用Docker进行开发

也可以使用Docker进行开发，特别适合测试各服务间的交互:

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 只启动特定服务
docker-compose up -d blog-web

# 重新构建特定服务
docker-compose build blog-web
```

### 共享代码开发

当开发跨应用共享代码(`packages/web-shared`)时:

1. 进行修改
2. 在应用中引用共享包：
   ```js
   // 在应用中引用共享包
   import { someUtil } from 'web-shared';
   ```
3. 受益于Monorepo架构，修改会立即反映在使用该包的应用中

## 部署流程

### 生产环境部署

#### 方法1: 使用GitHub Actions自动部署

只需将代码推送到main分支，GitHub Actions就会自动:
1. 构建Docker镜像
2. 推送到Docker Hub
3. 在服务器上拉取新镜像并重启服务

#### 方法2: 手动部署

1. 准备环境变量
   ```bash
   cp .env.example .env.production
   # 编辑.env.production文件填写生产环境信息
   ```

2. 在服务器上拉取代码
   ```bash
   git clone https://github.com/yourusername/hs-blog.git
   cd hs-blog
   ```

3. 启动服务
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### 部署架构

```
用户请求 --> Nginx反向代理 --> 各Docker容器(blog-web/blog-portal/blog-admin/blog-server)
```

## 最佳实践

### Monorepo最佳实践

1. **明确的包依赖**: 在package.json中显式声明依赖关系
2. **版本控制策略**: 使用统一版本或独立版本管理
3. **清晰的代码边界**: 不同应用/包有明确的职责划分
4. **共享代码提取**: 将通用代码提取到shared包中

### Docker最佳实践

1. **多阶段构建**: 减小最终镜像大小
2. **合理的资源限制**: 设置适当的内存限制
3. **数据持久化**: 使用volumes保存重要数据
4. **使用环境变量**: 通过环境变量注入配置
5. **健康检查**: 配置健康检查确保容器正常运行

### CI/CD最佳实践

1. **精确的触发规则**: 只在相关文件变更时触发工作流
2. **缓存策略**: 缓存依赖和构建成果
3. **并行作业**: 并行运行独立任务
4. **安全凭证管理**: 使用GitHub Secrets安全存储凭证
5. **回滚策略**: 准备回滚方案以应对部署失败

## 常见问题解答

### Q: 如何在开发中处理跨应用依赖?
A: 得益于Monorepo和pnpm workspaces，你可以直接使用`import { x } from 'package-name'`引用其他包，无需发布到npm。

### Q: 如何只构建和部署特定应用?
A: 使用`docker-compose build blog-web`和`docker-compose up -d blog-web`来单独构建和部署。

### Q: 如何处理容器间的通信?
A: 容器在同一`hs-blog-network`网络中，可以通过服务名互相访问，如`http://blog-server:7790/api`。

### Q: 如何监控Docker容器的运行状态?
A: 使用`docker stats`或设置监控工具如Prometheus+Grafana。

### Q: 环境变量如何在容器间共享?
A: 通过`.env.production`文件和docker-compose的`env_file`设置共享环境变量。

### Q: 如何管理数据库迁移?
A: 在API服务中配置迁移脚本，并在容器启动时自动运行。

### Q: 如何扩展项目添加新服务?
A: 
1. 在`apps/`目录下创建新服务
2. 为其添加Dockerfile
3. 在docker-compose.yml中添加服务配置
4. 在.github/workflows中添加CI/CD配置

### Q: 如何查看容器日志?
A: 使用`docker-compose logs -f [服务名]`查看特定服务日志。 
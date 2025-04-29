# Docker从零入门 - 基于Monorepo项目实战教程

这份教程专为Docker小白设计，帮助你理解如何在Monorepo项目中使用Docker进行容器化部署。无需复杂背景知识，我们会从最基础讲起。

## 目录

- [什么是Docker？](#什么是docker)
- [为什么要用Docker？](#为什么要用docker)
- [准备工作](#准备工作)
- [Docker基本概念](#docker基本概念)
- [第一步：编写Dockerfile](#第一步编写dockerfile)
- [第二步：创建Docker Compose](#第二步创建docker-compose)
- [第三步：运行你的容器](#第三步运行你的容器)
- [常见问题和解决方案](#常见问题和解决方案)
- [Docker命令速查表](#docker命令速查表)

## 什么是Docker？

简单来说，Docker就像是一个"可移动的小盒子"，里面打包了你的应用程序以及它运行所需的所有环境。这样，无论在什么电脑或服务器上，你的应用都能以相同的方式运行，不再担心"在我电脑上能运行啊"的问题。

![Docker形象比喻](https://docs.docker.com/get-started/images/container-what-is-container.png)

## 为什么要用Docker？

想象你正在开发一个含有多个服务的博客系统：

- 博客前台网站
- 管理后台系统
- API服务器
- 可能还有数据库等

每个服务可能需要不同的运行环境、不同的依赖。如果直接部署，你会面临：

- 环境不一致：开发环境和生产环境不同
- 依赖冲突：不同服务需要不同版本的依赖
- 部署复杂：每个服务都需要单独配置和启动
- 资源浪费：多个服务可能需要多台服务器

Docker可以解决这些问题，让你的应用更容易开发、部署和运行。

## 准备工作

1. 安装Docker Desktop
   - [Windows下载](https://docs.docker.com/desktop/install/windows-install/)
   - [Mac下载](https://docs.docker.com/desktop/install/mac-install/)
   - Linux: `sudo apt-get install docker-ce docker-ce-cli containerd.io`

2. 确认安装成功
   ```bash
   docker --version
   # 应该显示类似: Docker version 20.10.21
   
   docker-compose --version
   # 应该显示类似: Docker Compose version v2.13.0
   ```

## Docker基本概念

在开始前，先了解几个关键概念：

- **镜像(Image)**: 相当于应用的只读模板，包含了代码、运行环境、依赖库等
- **容器(Container)**: 镜像运行时的实例，相当于一个轻量级的虚拟机
- **Dockerfile**: 创建Docker镜像的"食谱"，告诉Docker怎么做出你的应用
- **Docker Compose**: 管理多个容器的工具，用YAML文件定义各个服务

## 第一步：编写Dockerfile

Dockerfile是构建Docker镜像的蓝图。我们以Nuxt.js应用(博客前台)为例：

1. 在你的应用目录(`apps/hs-blog-web`)下创建`Dockerfile`文件：

```dockerfile
# 第一阶段：构建应用
FROM node:18-alpine AS build

# 设置工作目录
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

# 构建应用
RUN cd apps/hs-blog-web && npm run build

# 第二阶段：运行应用（减小镜像体积）
FROM node:18-alpine

WORKDIR /app

# 只复制构建好的应用
COPY --from=build /app/apps/hs-blog-web/.output ./.output
COPY --from=build /app/apps/hs-blog-web/package.json ./package.json

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", ".output/server/index.mjs"]
```

### Dockerfile详解

我们把Dockerfile分成两个阶段，这叫"多阶段构建"：

**第一阶段(构建阶段)**：
1. `FROM node:20-alpine AS build` - 基于Node.js 18创建一个临时环境
2. `WORKDIR /app` - 设置工作目录
3. `COPY ... ./` - 复制必要的文件（dependencies、代码等）
4. `RUN pnpm install` - 安装所有依赖
5. `RUN cd apps/hs-blog-web && npm run build` - 构建应用

**第二阶段(运行阶段)**：
1. `FROM node:20-alpine` - 创建一个全新的轻量环境
2. `COPY --from=build` - 只复制第一阶段构建好的产物
3. `ENV` - 设置环境变量
4. `EXPOSE 3000` - 声明容器将监听的端口
5. `CMD ["node", ".output/server/index.mjs"]` - 启动命令

> **小贴士**：多阶段构建可以大幅减小最终镜像的体积，因为构建工具、源码等不会包含在最终镜像中！

## 第二步：创建Docker Compose

当项目包含多个服务时，我们需要Docker Compose来协调它们。在项目根目录创建`docker-compose.yml`：

```yaml
version: '3.8'

services:
  # 博客前台
  blog-web:
    build:
      context: .  # 构建上下文是项目根目录
      dockerfile: apps/hs-blog-web/Dockerfile
    container_name: hs-blog-web
    ports:
      - "7788:3000"  # 主机7788端口映射到容器3000端口
    environment:
      - NODE_ENV=production
    volumes:
      - blog_web_data:/app/data  # 持久化数据
    networks:
      - hs-blog-network
    depends_on:
      - blog-server  # 依赖API服务
  
  # API服务
  blog-server:
    build:
      context: .
      dockerfile: apps/hs-blog-server/Dockerfile
    container_name: hs-blog-server
    ports:
      - "7790:7790"
    volumes:
      - blog_server_data:/app/data
    networks:
      - hs-blog-network
    environment:
      - NODE_ENV=production

# 创建网络，让容器可以互相通信
networks:
  hs-blog-network:
    driver: bridge

# 创建持久化数据卷
volumes:
  blog_web_data:
  blog_server_data:
```

### Docker Compose详解

- **services**: 定义所有服务（容器）
  - **build**: 指定Dockerfile位置
  - **container_name**: 容器名称
  - **ports**: 端口映射，格式为"主机端口:容器端口"
  - **environment**: 环境变量
  - **volumes**: 数据卷，用于持久化数据
  - **networks**: 网络配置，让容器间可以通信
  - **depends_on**: 依赖关系，确保某些容器先启动

## 第三步：运行你的容器

有了Dockerfile和docker-compose.yml，现在可以启动你的应用了！

### 基本命令

```bash
# 构建并启动所有服务（-d表示后台运行）
docker-compose up -d

# 查看运行中的容器
docker-compose ps

# 查看容器日志
docker-compose logs -f blog-web

# 停止所有容器
docker-compose down

# 重新构建并启动特定服务
docker-compose up -d --build blog-web
```

### 单独处理某个服务

```bash
# 只构建博客前台
docker-compose build blog-web

# 只启动博客前台
docker-compose up -d blog-web

# 重启博客前台
docker-compose restart blog-web

# 进入容器内部（例如调试）
docker exec -it hs-blog-web sh
```

## 容器间如何通信？

在同一`docker-compose.yml`中定义的容器可以通过**容器名称**相互访问：

例如，博客前台可以通过`http://blog-server:7790/api`访问API服务，而不需要使用主机IP或localhost。

Docker自动创建了一个内部网络，容器可以像在同一局域网内的计算机一样互相通信。

## 常见问题和解决方案

### 1. 端口冲突

**症状**: `Error starting userland proxy: listen tcp 0.0.0.0:7788: bind: address already in use`

**解决方案**:
```bash
# 查找占用端口的进程
netstat -ano | findstr 7788    # Windows
lsof -i :7788                  # Mac/Linux

# 修改docker-compose.yml中的端口映射
ports:
  - "7789:3000"  # 改用其他端口
```

### 2. 容器无法访问网络

**解决方案**:
```bash
# 检查DNS设置
docker-compose exec blog-web cat /etc/resolv.conf

# 在Dockerfile中添加
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf
```

### 3. 数据卷权限问题

**解决方案**:
```bash
# 在Dockerfile中添加
RUN mkdir -p /app/data && chmod 777 /app/data
```

### 4. 镜像构建太慢

**解决方案**:
- 使用`.dockerignore`文件排除不必要的文件
- 优化Dockerfile，减少层数
- 考虑使用国内镜像源

## Docker命令速查表

| 命令 | 说明 |
|------|------|
| `docker-compose up -d` | 后台启动所有服务 |
| `docker-compose down` | 停止并移除所有容器 |
| `docker-compose ps` | 查看运行中的容器 |
| `docker-compose logs -f [服务名]` | 查看指定服务的日志 |
| `docker-compose build [服务名]` | 构建指定服务 |
| `docker-compose restart [服务名]` | 重启指定服务 |
| `docker exec -it [容器名] sh` | 进入容器内部 |
| `docker-compose config` | 验证docker-compose.yml配置 |

## Docker与Monorepo项目结合的要点

1. **构建上下文很重要**：在`build.context`中指定为项目根目录，这样才能访问到所有子项目
   
2. **共享代码处理**：在Dockerfile中需要复制`packages`目录，确保依赖项可用
   
3. **依赖安装优化**：使用pnpm等包管理器可以减少安装时间和空间

4. **环境变量管理**：可以使用`.env.production`文件集中管理环境变量
   ```yaml
   # docker-compose.yml
   services:
     blog-web:
       env_file:
         - .env.production
   ```

5. **多阶段构建**：减小最终镜像体积，提高部署效率

## 总结

恭喜你！现在你已经了解了如何在Monorepo项目中使用Docker，从编写Dockerfile到使用Docker Compose管理多个服务。这些知识可以帮助你更轻松地开发、测试和部署你的应用。

记住，Docker的强大之处在于它的可重复性和一致性。无论开发环境还是生产环境，你的应用都会以相同的方式运行，大大减少了"在我电脑上能运行"的问题。

继续尝试，你会发现Docker还有更多强大功能等待你探索！ 
# 构建阶段
FROM node:20-alpine AS build

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制应用程序代码
COPY apps/hs-blog-server ./apps/hs-blog-server
COPY packages ./packages

# 安装依赖
RUN pnpm install

# 构建应用
RUN pnpm build:blog-server

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 从构建阶段复制文件
COPY --from=build /app/apps/hs-blog-server/dist ./dist
COPY --from=build /app/apps/hs-blog-server/package.json ./

# 暴露API服务端口
EXPOSE 7790

# 设置环境变量
ENV PORT=7790
ENV NODE_ENV=production

# 安装生产依赖
RUN npm install --only=production

# 启动应用
CMD ["node", "dist/main.js"] 
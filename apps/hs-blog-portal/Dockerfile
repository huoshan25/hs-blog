# 构建阶段
FROM node:20-alpine AS build

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制应用程序代码
COPY apps/hs-blog-portal ./apps/hs-blog-portal
COPY packages ./packages

# 安装依赖
RUN pnpm install

# 构建应用
RUN pnpm build:blog-portal

# 生产阶段 - 使用node直接运行Next.js
FROM node:20-alpine

WORKDIR /app

# 从构建阶段复制文件
COPY --from=build /app/apps/hs-blog-portal/.next ./.next
COPY --from=build /app/apps/hs-blog-portal/public ./public
COPY --from=build /app/apps/hs-blog-portal/package.json ./
COPY --from=build /app/apps/hs-blog-portal/next.config.ts ./

# 安装生产依赖
RUN npm install --only=production --legacy-peer-deps

# 暴露端口
EXPOSE 7787

# 设置环境变量
ENV PORT=7787
ENV NODE_ENV=production

# 启动应用
CMD ["npm", "start"] 
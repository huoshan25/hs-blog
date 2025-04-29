# 构建阶段
FROM node:20-alpine AS build

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

# 生产阶段 - 使用node运行Nuxt应用，使用Nginx作为前端代理
FROM node:20-alpine

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
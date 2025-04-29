# 构建阶段
FROM node:20-alpine AS build

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制应用程序代码
COPY apps/hs-blog-admin ./apps/hs-blog-admin
COPY packages ./packages

# 安装依赖
RUN pnpm install

# 构建应用
RUN pnpm build:blog-admin

# 生产阶段 - 使用nginx提供静态文件
FROM nginx:alpine

# 从构建阶段复制静态文件到nginx目录
COPY --from=build /app/apps/hs-blog-admin/dist /usr/share/nginx/html

# 添加自定义nginx配置
RUN echo 'server { \
    listen 7789; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        alias /usr/share/nginx/html/assets; \
        expires 365d; \
        add_header Cache-Control "public, max-age=31536000, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 7789

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 
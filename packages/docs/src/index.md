---
layout: home

hero:
  name: HS Blog
  text: 博客系统及共享工具包
  tagline: 一个基于Monorepo的前端工程化项目
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 共享包文档
      link: /shared/
    - theme: alt
      text: 在GitHub上查看
      link: https://github.com/your-org/hs-blog

features:
  - title: 工程化
    details: 基于pnpm workspace和Turborepo的Monorepo架构，支持多项目管理和依赖共享
  - title: 共享工具
    details: 提供日期处理、字符串操作、HTTP请求等常用工具函数，以及枚举和类型定义
  - title: 统一规范
    details: 规范化的代码风格、提交信息和版本发布流程，提高团队协作效率
  - title: 全栈支持
    details: 前端采用Vue/React，后端使用NestJS，支持全栈开发
---

<div class="custom-block">
  <h2>项目架构</h2>
  <div class="language-bash">
    <pre><code><span class="line"><span>hs-blog/</span></span>
<span class="line"><span>├── apps/</span></span>
<span class="line"><span>│   ├── hs-blog-web/      # 前台博客（Nuxt）</span></span>
<span class="line"><span>│   ├── hs-blog-admin/    # 后台管理（Vue）</span></span>
<span class="line"><span>│   ├── hs-blog-portal/   # 门户网站（Vue）</span></span>
<span class="line"><span>│   └── hs-blog-server/   # 后端服务（NestJS）</span></span>
<span class="line"><span>└── packages/</span></span>
<span class="line"><span>    ├── web-shared/       # 共享工具包</span></span>
<span class="line"><span>    └── docs/             # 文档站点（VitePress）</span></span></code></pre>
  </div>
</div> 
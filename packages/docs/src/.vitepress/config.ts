import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HS Blog 文档',
  description: '博客系统及共享包文档',
  lang: 'zh-CN',
  lastUpdated: true,
  
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '共享包', link: '/shared/' },
      { text: '示例', link: '/examples/' },
      { text: 'API参考', link: '/api/' },
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' }
          ]
        }
      ],
      '/shared/': [
        {
          text: '共享包',
          items: [
            { text: '介绍', link: '/shared/' },
            { text: '安装和使用', link: '/shared/usage' },
            { text: '工具函数', link: '/shared/utils' },
            { text: '枚举', link: '/shared/enums' },
            { text: '类型定义', link: '/shared/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础示例', link: '/examples/' },
            { text: '日期工具', link: '/examples/date' },
            { text: '字符串工具', link: '/examples/string' },
            { text: 'HTTP工具', link: '/examples/http' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: '日期工具', link: '/api/date' },
            { text: '字符串工具', link: '/api/string' },
            { text: 'HTTP工具', link: '/api/http' },
            { text: '枚举', link: '/api/enums' },
            { text: '类型', link: '/api/types' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/hs-blog' }
    ],
    
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2025'
    },
    
    // 搜索配置
    search: {
      provider: 'local'
    }
  }
}) 
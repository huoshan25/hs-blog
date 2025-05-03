// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devServer: {
    port: 7788
  },

  /*构建时启用类型检查*/
  typescript: {
    typeCheck: true
  },

  app: {
    head: {
      /*避免组件膳所*/
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: '火山博客',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'description',
          content:
            '火山博客 - 欢迎来到我的技术学习笔记，这里记录了一名前端开发的成长之旅。从编程基础到最新技术趋势，分享实用的代码片段、个人项目经验和学习资源。无论你是刚入门的新手，还是希望持续学习的同行，都能在这里找到共鸣和帮助。让我们一起探索技术的乐趣，共同进步！'
        },
        { name: 'keywords', content: '火山博客,稀土,Vue.js,前端面试题,node,ReactNative,Python,' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'renderer', content: 'webkit' },
        { name: 'author', content: '2633057734@qq.com' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
        { rel: 'stylesheet', href: 'https://chinese-fonts-cdn.deno.dev/packages/syst/dist/SourceHanSerifCN/result.css' }
      ],
      script: []
    }
  },

  nitro: {
    /*接口代理配置*/
    routeRules: {
      '/api/proxy/**': {
        proxy: 'http://127.0.0.1:7790/api/blog/**'
      }
    },

    /*生成robots.txt*/
    prerender: {
      routes: ['/robots.txt']
    }
  },

  imports: {
    dirs: [
      // 扫描顶级模块
      'composables',
      // ... 或扫描带有特定名称和文件扩展名的一级嵌套模块
      'composables/*/index.{ts,js,mjs,mts}',
      // ... 或扫描给定目录中的所有模块
      'composables/**'
    ]
  },

  runtimeConfig: {
    /**私有密钥仅在服务器端可用*/
    apiSecret: '',

    /**对客户端暴露的公共密钥*/
    public: {
      apiBaseUrl: '',
      /*网站域名*/
      siteUrl: ''
    }
  },

  modules: ['@unocss/nuxt', '@nuxt/image', '@vueuse/nuxt'],

  css: ['~/assets/style/default.scss'],

  srcDir: 'src/',

  vite: {
    ssr: {
      // https://github.com/histoire-dev/histoire/issues/488
      // 避免 SSR 期间引入这些客户端专用的包
      // noExternal: ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@juggle/resize-observer']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/variables.scss" as *;'
        }
      }
    },
    // optimizeDeps: {
    //   include: process.env.NODE_ENV === 'development' ? ['naive-ui', 'vueuc'] : []
    // },
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  },

  devtools: { enabled: true }
})

import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  setup() {
    // 自定义主题逻辑
  },
  enhanceApp({ app }) {
    // 注册全局组件
  }
} satisfies Theme 
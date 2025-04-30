import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导入web-shared插件
import { injectStyles, globalStyles, VueComponents } from 'web-shared'

const app = createApp(App)

// 使用状态管理和路由
app.use(createPinia())
app.use(router)

// 注入web-shared样式
injectStyles(globalStyles)

// 注册web-shared组件
app.component('HsIcon', VueComponents.Icon)
app.component('HsButton', VueComponents.Button)
app.component('HsAlert', VueComponents.Alert)

app.mount('#app')

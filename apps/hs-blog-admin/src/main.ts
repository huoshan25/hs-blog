import '@/assets/style/variables.scss'
import '@/assets/style/default.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'virtual:uno.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

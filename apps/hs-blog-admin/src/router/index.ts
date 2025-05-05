import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { requiresAuth: true, title: '仪表盘' }
        },
        {
          path: 'articleManage',
          name: 'articleManage',
          component: () => import('@/views/articleManage/index.vue'),
          meta: { requiresAuth: true, title: '文章管理' }
        },
        {
          path: 'categoryManage',
          name: 'categoryManage',
          component: () => import('@/views/categoryManage/index.vue'),
          meta: { requiresAuth: true, title: '分类管理' }
        },
        {
          path: 'profileManage',
          name: 'profileManage',
          component: () => import('@/views/profileManage/index.vue'),
          meta: { requiresAuth: true, title: '个人管理' }
        },
        {
          path: 'linkManage',
          name: 'linkManage',
          component: () => import('@/views/linkManage/index.vue'),
          meta: { requiresAuth: true, title: '链接管理' }
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false, title: '登录' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ],
})

router.beforeEach((to, from, next) => {
  const { token } = useUser()

  document.title = `${to.meta.title || '后台管理'} - 博客系统`

  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router

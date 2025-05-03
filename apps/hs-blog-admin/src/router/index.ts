import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'articleManage',
          name: 'articleManage',
          component: () => import('@/views/articleManage/index.vue'),
        },
        {
          path: 'categoryManage',
          name: 'categoryManage',
          component: () => import('@/views/categoryManage/index.vue'),
        },
        {
          path: 'profileManage',
          name: 'profileManage',
          component: () => import('@/views/profileManage/index.vue'),
        },
      ],
    },
  ],
})

export default router

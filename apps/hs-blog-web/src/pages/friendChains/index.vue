<script setup lang="ts">
  import { ref } from 'vue'
  import FriendLinkApplySection from './components/friendLinkApplySection.vue'
  import FriendLinksGrid from './components/friendLinksGrid.vue'
  import FriendLinkApplyModal from './components/friendLinkApplyModal.vue'

  definePageMeta({
    layout: 'default'
  })

  export interface FriendLink {
    name: string
    avatar: string
    description: string
    url: string
    tags?: string[]
    category: string
  }

  const showApplyModal = ref(false)

  const friendLinks = ref<FriendLink[]>([
    {
      name: '火山博客',
      avatar: '/svg/logo.svg',
      description: '一个充满创意的技术博客',
      url: 'https://example.com',
      tags: ['技术', 'Web开发'],
      category: '技术博客'
    }
  ])

  const categories = ['技术博客', '生活博客', '设计博客', '其他']
  const activeCategory = ref('全部')

  const filteredFriends = computed(() => {
    if (activeCategory.value === '全部') return friendLinks.value
    return friendLinks.value.filter(friend => friend.category === activeCategory.value)
  })

  const handleApplySubmit = () => {}
</script>

<template>
  <div class="friends-page">
    <div class="container">
      <!-- 页面标题区域 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="title">友情链接</h1>
          <p class="subtitle">认识更多有趣的朋友</p>
          <div class="stats">
            <div class="stat-item">
              <span class="number">{{ friendLinks.length }}</span>
              <span class="label">个友链</span>
            </div>
            <div class="stat-item">
              <span class="number">{{ categories.length }}</span>
              <span class="label">个分类</span>
            </div>
          </div>
        </div>
        <div class="header-decoration">
          <div class="decoration-circle" />
        </div>
      </div>

      <!-- 分类过滤器 -->
      <div class="category-filter">
        <n-button-group>
          <n-button
            v-for="category in ['全部', ...categories]"
            :key="category"
            :type="activeCategory === category ? 'primary' : 'default'"
            @click="activeCategory = category"
          >
            {{ category }}
          </n-button>
        </n-button-group>
      </div>

      <!-- 友链展示区域 -->
      <FriendLinksGrid :friend-links="filteredFriends" />

      <!-- 申请友链区域 -->
      <FriendLinkApplySection @apply="showApplyModal = true" />

      <!-- 申请友链模态框 -->
      <FriendLinkApplyModal v-model:show="showApplyModal" @submit="handleApplySubmit" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .friends-page {
    padding: 2rem;
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    position: relative;
    background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 2rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    .header-content {
      position: relative;
      z-index: 1;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .stats {
      display: flex;
      gap: 2rem;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .number {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .label {
          font-size: 0.9rem;
          color: #666;
        }
      }
    }

    .header-decoration {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 40%;
      overflow: hidden;

      .decoration-circle {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(24, 160, 88, 0.1) 0%, rgba(24, 160, 88, 0.05) 100%);
        top: -100px;
        right: -100px;
      }
    }
  }

  .category-filter {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
  }
</style>

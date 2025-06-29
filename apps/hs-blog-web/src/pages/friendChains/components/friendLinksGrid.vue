<script setup lang="ts">
  import type { FriendLink } from '~/pages/friendChains/index.vue'
  import { ref } from 'vue'

  defineProps<{
    friendLinks: FriendLink[]
  }>()

  /**控制每个卡片的展开状态 */
  const expandedCards = ref<Record<string, boolean>>({})

  /**切换卡片展开状态 */ 
  const toggleExpand = (name: string) => {
    expandedCards.value[name] = !expandedCards.value[name]
  }
</script>

<template>
  <div class="friends-container">
    <div class="friends-grid">
      <div v-for="friend in friendLinks" :key="friend.name" class="friend-card">
        <div class="card-inner">
          <!-- 头像和基本信息 -->
          <div class="card-header">
            <div class="avatar-wrapper">
              <img :src="friend.avatar" :alt="friend.name" class="avatar" />
            </div>
            <div class="basic-info">
              <h3 class="friend-name">
                <a :href="friend.url" target="_blank" rel="noopener noreferrer">
                  {{ friend.name }}
                </a>
              </h3>
              <a :href="friend.url" target="_blank" class="visit-link">
                访问站点 →
              </a>
            </div>
          </div>
          
          <!-- 标签区域 -->
          <div class="tags-section" v-if="friend.tags && friend.tags.length">
            <div class="tags-wrapper">
              <n-tag 
                v-for="tag in friend.tags" 
                :key="tag" 
                size="small" 
                round
                class="friend-tag"
                :bordered="false"
              >
                {{ tag }}
              </n-tag>
            </div>
          </div>
          
          <!-- 描述内容 -->
          <div class="content-section">
            <p class="friend-description" :class="{ 'expanded': expandedCards[friend.name] }">
              {{ friend.description }}
            </p>
            <div v-if="friend.description.length > 100" class="expand-button" @click="toggleExpand(friend.name)">
              {{ expandedCards[friend.name] ? '收起' : '展开全部' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .friends-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .friends-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      gap: 2rem;
    }
  }

  .friend-card {
    height: 100%;
    
    .card-inner {
      height: 100%;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 1.5rem 0.75rem;
    border-bottom: none;
  }

  .avatar-wrapper {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #f3f4f6;
  }

  .basic-info {
    flex: 1;
    min-width: 0;
  }

  .friend-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    
    a {
      color: #1f2937;
      text-decoration: none;
      word-break: break-all;
      
      &:hover {
        color: #3b82f6;
      }
    }
  }

  .visit-link {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #3b82f6;
    }
  }

  .tags-section {
    padding: 0 1.5rem 0.5rem;
    margin-top: 0;
  }

  .tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .friend-tag {
    background: #f3f4f6;
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
    
    &:hover {
      background: #e5e7eb;
      color: #374151;
    }
  }

  .content-section {
    flex: 1;
    padding: 0.75rem 1.5rem 1.5rem;
    position: relative;
    border-top: none;
  }

  .friend-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 4.2rem;
    transition: all 0.3s ease;
    
    &.expanded {
      -webkit-line-clamp: initial;
      max-height: none;
    }
  }

  .expand-button {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #3b82f6;
    cursor: pointer;
    text-align: right;
    
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    .friends-container {
      padding: 0 0.5rem;
    }
    
    .card-header {
      padding: 1rem 1rem 0.5rem;
      gap: 0.75rem;
    }
    
    .avatar-wrapper {
      width: 50px;
      height: 50px;
    }
    
    .content-section {
      padding: 0.5rem 1rem 1rem;
    }
    
    .tags-section {
      padding: 0 1rem 0.5rem;
    }
    
    .friend-name {
      font-size: 1rem;
    }
    
    .friend-description {
      font-size: 0.8rem;
    }
  }
</style>


<script setup lang="ts">
  import type { FriendLink } from '~/pages/friendChains/index.vue'

  defineProps<{
    friendLinks: FriendLink[]
  }>()
</script>

<template>
  <div class="friends-grid">
    <div v-for="friend in friendLinks" :key="friend.name" class="friend-card">
      <n-card hoverable>
        <div class="card-content">
          <div class="avatar-wrapper">
            <img :src="friend.avatar" :alt="friend.name" class="avatar" />
            <div class="avatar-overlay">
              <n-button text type="primary" tag="a" :href="friend.url" target="_blank">访问</n-button>
            </div>
          </div>
          <div class="info">
            <h3 class="name">
              <a :href="friend.url" target="_blank" rel="noopener noreferrer">{{ friend.name }}</a>
            </h3>
            <p class="description">{{ friend.description }}</p>
            <div class="tags">
              <n-tag v-for="tag in friend.tags" :key="tag" size="small" round>
                {{ tag }}
              </n-tag>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .friends-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .friend-card {
    transition: all 0.3s ease;
    background: #fff;
    border-radius: 0.5rem;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);

      .avatar-overlay {
        opacity: 1;
      }
    }

    .card-content {
      display: flex;
      gap: 1rem;
      padding: 1rem;
    }

    .avatar-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .info {
      flex: 1;
    }

    .name {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;

      a {
        color: #333;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    .description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
</style>

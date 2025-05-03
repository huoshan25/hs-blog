<script setup lang="ts">
  import CategoryList, { type ICategory } from '~/components/CategoryList.vue'
  import { HttpStatus } from '~/enums/httpStatus'
  import { getAllCategories } from '~/api/home'
  import Personal from './components/personal.vue'
  import ArticleList from './components/articleList.vue'
  import calender from './components/calendar.vue'

  const route = useRoute()

  definePageMeta({
    layout: 'default'
  })

  /**文章分类*/
  const categoryList = ref()

  const titleName = ref()

  const { data: categoryData } = await useAsyncData('categories', () => getAllCategories(), {
    default: () => {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: []
      }
    }
  })

  if (categoryData.value?.code === HttpStatus.OK) {
    categoryList.value = categoryData.value.data.map((item: ICategory) => {
      return {
        id: item.id,
        alias: `/${item.alias}`,
        name: item.name,
        icon: item.icon
      }
    })

    titleName.value = categoryList.value?.find((item: ICategory) => item.alias === `/${route?.params?.alias}`)
  }

  useHead({
    title: titleName.value?.name || null,
    titleTemplate: titleChunk => (titleChunk ? `${titleChunk} - 火山博客` : '火山博客')
  })

  onMounted(() => {})
</script>

<template>
  <main class="main">
    <category-list :categoryList="categoryList" @toCategoryl="" />
    <!-- 类目内容 -->
    <div class="contents">
      <div class="contents-left">
        <!-- 移动端菜单 -->
        <div class="mobile-category-list">
          <div class="category-container">
            <nuxt-link v-for="category in categoryList" :key="category.id" :to="category.alias" class="category-item">
              {{ category.name }}
            </nuxt-link>
          </div>
        </div>
        <!-- 文章列表 -->
        <ClientOnly>
          <article-list :categoryList="categoryList" />
        </ClientOnly>
      </div>
      <div class="contents-right">
        <!-- 个人 -->
        <personal :categoryList="categoryList" />
        <!-- 博客日历 -->
        <ClientOnly>
          <calender />
        </ClientOnly>
      </div>
    </div>
  </main>

  <n-back-top />
</template>

<style scoped lang="scss">
  .main {
    padding: 0 4vw;
    display: flex;
    justify-content: center;
  }

  /*主要内容*/
  .contents {
    &-left {
      display: flex;
      flex-direction: column;
      width: 720px;
    }

    &-right {
      display: flex;
      flex-direction: column;
      width: 300px;
      margin-left: 20px;
    }
  }

  .mobile-category-list {
    display: none;
    background: white;
    margin-bottom: 3px;
  }

  .category-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;

    // 鼠标悬停或激活状态时显示滚动条
    &:hover,
    &:active {
      &::-webkit-scrollbar {
        display: block;
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 1px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }

  .category-item {
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      color: #1890ff;
      background-color: rgba(24, 144, 255, 0.1);
    }
  }

  @media (max-width: 1213px) {
    .contents-right {
      display: none;
    }
  }

  @media (max-width: 895px) {
    .contents-left {
      width: 100%;
    }

    .mobile-category-list {
      display: flex;
    }
  }
</style>

<script setup lang="ts">
  import { getTagsAll, getTagsQueryArticle } from '~/api/tag'
  import { HttpStatus } from '~/enums/httpStatus'
  import { SearchDimension } from '~/pages/search/components/enum'
  import ArticleList from './components/articleList.vue'
  import type { TagsList, TagsQueryArticleRes } from '~/api/tag/type'

  definePageMeta({
    layout: 'default',
    middleware: async to => {
      const res = await getTagsAll()
      if (res.code === HttpStatus.OK) {
        const tagName = to.params.tagName as string
        if (res.data && !res.data.list.some((tag: TagsList) => tag.name === tagName)) {
          return showError({ statusCode: HttpStatus.FORBIDDEN, message: '未找到标签' })
        }
      }
    }
  })

  const route = useRoute()
  const router = useRouter()

  const articleList = ref<TagsQueryArticleRes[]>([])

  /**
   * tabs更新回调
   * @param tabSValue
   */
  const handleUpdateValue = (tabSValue: SearchDimension) => {
    const newQuery = {
      ...route.query,
      type: tabSValue
    }
    router.push({
      path: `/tag/${route.params?.tagName}`,
      query: newQuery
    })
  }

  const getArticleList = async () => {
    const params = {
      tagName: route.params?.tagName as string,
      limit: 10,
      page: 1
    }
    const res = await getTagsQueryArticle(params)
    if (res.code === HttpStatus.OK) {
      articleList.value = res.data
    }
  }

  watchEffect(() => {})

  onMounted(() => {
    getArticleList()
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center py-[40px] bg-[#f8f9fa] color-#666">
        <h1 class="m-[0]">{{ route.params?.tagName }}</h1>
    <div>{{ articleList.length }} 文章</div>
  </div>

  <div class="flex">
    <div class="flex flex-col items-center justify-center w-[100vw] h-[100vh] mt-[20px]">
      <div class="tabs p-[5px] w-[950px] bg-white">
        <ClientOnly>
          <n-tabs class="p-[15px]" type="line" animated @update:value="handleUpdateValue">
            <n-tab-pane :name="SearchDimension.SYNTHESIS" tab="综合" />
            <n-tab-pane :name="SearchDimension.ARTICLE" tab="热门" />
            <n-tab-pane :name="SearchDimension.TAG" tab="最新" />
          </n-tabs>
        </ClientOnly>
      </div>
      <!-- 文章列表 -->
      <ClientOnly>
        <article-list class="w-[960px] mt-[10px]" :articleList="articleList" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
    border-bottom: none;
  }

  :deep(.n-tab-pane),
  :deep(.n-tabs-bar) {
    display: none;
  }

  .tabs {
    box-shadow: inset 0 7px 8px -6px rgba(234, 232, 232, 0.9);
  }
</style>

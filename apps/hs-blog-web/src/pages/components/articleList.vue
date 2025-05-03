<script setup lang="ts">
  import { EyeOutline } from '@vicons/ionicons5'
  import { getArticle } from '~/api/home'
  import type { ICategory } from '~/components/CategoryList.vue'
  import { HttpStatus } from '~/enums/httpStatus'
  import { type ArticleItem, ArticleType } from '~/api/home/type'
  import { useUrlPreview } from '~/utils/useUrlPreview'

  const props = defineProps({
    categoryList: {
      type: Object,
      default() {
        return []
      }
    }
  })

  const { parseUrl, getUrlPreview } = useUrlPreview()

  const route = useRoute()

  const loading = ref(false)
  const cursor = ref<number | null>(null)
  const hasMore = ref(true)
  const articles = ref<ArticleItem[]>([])
  const aliasList = ref<ICategory | null>(null)
  const calendar = ref<string | null>(null)

  /*虚拟列表*/
  const virtualListRef = ref()

  if (Array.isArray(props.categoryList) && props.categoryList.length > 0) {
    if (route.params.alias === '') {
      aliasList.value = props.categoryList[0];
    } else {
      aliasList.value = props.categoryList.find((item: ICategory) => 
        item.alias === `/${route.params.alias}`
      ) || props.categoryList[0];
    }
  }

  const urlPreviews = ref(new Map())

  // 预先获取所有外部链接的预览信息
  const preloadUrlPreviews = async (articlesList: ArticleItem[]) => {
    const externalArticles = articlesList.filter(article => article.type === ArticleType.EXTERNAL)

    for (const article of externalArticles) {
      if (!urlPreviews.value.has(article.link_url)) {
        try {
          const preview = await getUrlPreview(article.link_url)
          urlPreviews.value.set(article.link_url, preview)
        } catch (error) {
          console.error(`Failed to fetch preview for ${article.link_url}:`, error)
        }
      }
    }
  }

  /*加载文章列表*/
  const loadArticles = async () => {
    if (loading.value || !hasMore.value || !aliasList.value?.id) return

    loading.value = true
    try {
      const res = await getArticle({
        categoryId: aliasList.value.id,
        cursor: cursor.value,
        limit: 10,
        date: calendar.value
      })

      if (res.code === HttpStatus.OK) {
        const response = res.data
        articles.value.push(...response.list)
        cursor.value = response.cursor
        hasMore.value = response.hasMore

        await preloadUrlPreviews(response.list)
      }
    } finally {
      loading.value = false
    }
  }

  const getPreview = (url: string) => {
    return urlPreviews.value.get(url)
  }

  watch(
    () => route.query.date,
    newDate => {
      cursor.value = null
      hasMore.value = true
      articles.value = []
      calendar.value = (newDate as string) || null

      loadArticles()
    },
    { immediate: true }
  )

  /**文章跳转*/
  const goDetails = (article: ArticleItem) => {
    const url = article.type === ArticleType.ORIGINAL ? `/post/${article.id}` : article.link_url
    navigateTo(url, {
      open: {
        target: '_blank'
      }
    })
  }

  /*标签页*/
  const goTabs = (tab: string) => {
    navigateTo(`/tag/${tab}`, {
      open: {
        target: '_blank'
      }
    })
  }

  /*处理滚动到底部*/
  const handleScroll = async () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (documentHeight - (scrollTop + windowHeight) < 100 && !loading.value && hasMore.value) {
      await loadArticles()
    }
  }

  onMounted(async () => {
    if (!aliasList.value?.id) {
      navigateTo('/')
      return
    }
    await loadArticles()
    // 添加全局滚动监听
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <div
    class="border-radius-0-6-6-6 shadow-[0_2px_5px_0_rgba(234,234,234,0.8)] bg-white flex justify-between flex-col h-[100%]"
  >
    <client-only>
      <n-scrollbar @scroll="handleScroll">
        <n-virtual-list ref="virtualListRef" :items="articles" :item-size="90" item-resizable class="animated-list">
          <template #default="{ item }">
            <div v-if="item.type === ArticleType.ORIGINAL" class="entry-list animate-entry" @click="goDetails(item)">
              <n-ellipsis class="font-700 font-size-[17px] line-height-[24px] w-full mb-[3px]" :tooltip="false">
                {{ item.title }}
              </n-ellipsis>
              <n-ellipsis class="w-full font-size-[13px] line-height-[22px] mb-[5px] color-#8a919f" :tooltip="false">
                {{ item.description }}
              </n-ellipsis>
              <div class="w-full flex justify-between">
                <div class="flex justify-center items-center color-#8a919f">
                  {{ item.category_name }}
                  <n-divider vertical />
                  <div class="flex justify-center items-center">
                    <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="EyeOutline" />
                    {{ item.view_count }}
                  </div>
                </div>
                <div class="entry-list-bottom-right">
                  <n-tag
                    v-for="tag in item.tags"
                    :key="tag.id + 'tag'"
                    :bordered="false"
                    style="margin-left: 6px"
                    size="small"
                    @click.stop="goTabs(tag.name)"
                    class="hover:(text-[#1e80ff] cursor-pointer)"
                  >
                    {{ tag.name }}
                  </n-tag>
                </div>
              </div>
            </div>
            <div v-else class="entry-list" @click="goDetails(item)">
              <div class="lex justify-between w-full">
                <div class="flex items-center">
                  <nuxt-img src="/svg/outsideChain.svg" size="20" class="mr-[3px]" format="webp" />
                  <n-ellipsis class="font-700 font-size-[17px] line-heigth-[24px] w-full mb-[3px]" :tooltip="false">
                    {{ item.title }}
                  </n-ellipsis>
                </div>
                <n-ellipsis
                  v-if="getPreview(item.link_url)?.description"
                  class="w-full font-size-[13px] line-height-[22px] mb-[5px] color-#8a919f"
                  :tooltip="false"
                >
                  {{ getPreview(item.link_url)?.description }}
                </n-ellipsis>
                <div class="flex justify-between w-full">
                  <div class="flex justify-center items-center color-#8a919f">
                    {{ item.category_name }}
                  </div>
                  <div class="flex justify-center items-center">
                    <nuxt-img
                      v-if="getPreview(item.link_url)?.favicon"
                      :src="getPreview(item.link_url)?.favicon"
                      placeholder="/svg/websiteIcon.svg"
                      alt="网站微标"
                      class="h-[15px] mr-[5px]"
                      format="webp"
                    />
                    <span>
                      {{ getPreview(item.link_url)?.siteName || parseUrl(item.link_url).domain }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </n-virtual-list>
      </n-scrollbar>
      <template #fallback>
        <div v-for="i in 2" :key="i + 'initialLoading'" class="entry-list">
          <Skeleton text :repeat="2" />
          <div class="w-full flex justify-between">
            <n-space>
              <Skeleton text width="60px" />
              <Skeleton text width="40px" />
              <Skeleton text width="40px" />
            </n-space>
            <n-space>
              <Skeleton text width="40px" />
              <Skeleton text width="40px" />
            </n-space>
          </div>
        </div>
      </template>
    </client-only>
    <NoMoreDataDivider :hasMore="loading" />
  </div>
</template>

<style scoped lang="scss">
  .animated-list {
    animation: slideDown 0.6s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /*类目模块*/
  .entry-list {
    cursor: pointer;
    padding: 17px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
    opacity: 0;
    animation: scaleUp 0.4s ease-out forwards;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }

    &:hover {
      background-color: #f7f8fa;
    }
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>

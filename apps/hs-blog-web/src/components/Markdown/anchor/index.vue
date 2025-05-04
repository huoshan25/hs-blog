<script setup lang="ts">
  import { ChevronDownSharp, ChevronUp } from '@vicons/ionicons5'

  interface Heading {
    level: number
    title: string
    id: string
  }

  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  })

  const collapsed = useState('toc-collapsed', () => false)
  const anchorWrapper = ref<HTMLElement | null>(null)

  const hasHeadings = computed(() => {
    return headings.value.length > 0
  })

  /**
   * 处理标题文本，移除HTML标签和处理markdown链接
   * @param title 标题文本
   */
  const processTitle = (title: string) => {
    // 处理HTML标签
    let processedTitle = title.replace(/<[^>]+>/g, match => {
      // 提取<a>标签中的文本内容
      const textMatch = match.match(/>([^<]+)</)
      return textMatch ? textMatch[1] : ''
    })

    // 处理markdown格式的链接 [text](url)
    processedTitle = processedTitle.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    return processedTitle.trim()
  }

  const headings = computed(() => {
    const lines = props.content?.split('\n')
    const result: Heading[] = []
    let index = 0

    lines?.forEach(line => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const rawTitle = match[2].trim()
        const title = processTitle(rawTitle)
        const id = `heading-${index++}`

        result.push({
          level,
          title,
          id
        })
      }
    })

    return result
  })

  /*获取当前可见的标题*/
  const getCurrentHeading = () => {
    for (const heading of headings.value) {
      const element = document.getElementById(heading.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        // 当标题进入视口顶部一定范围内时认为是当前标题
        if (rect.top >= 0 && rect.top <= 150) {
          return heading
        }
      }
    }
    return null
  }

  /*滚动侧边栏到当前标题位置*/
  const scrollTocToHeading = (headingId: string) => {
    if (collapsed.value || !anchorWrapper.value) return

    const tocItem = anchorWrapper.value.querySelector(`a[href="#${headingId}"]`)
    if (tocItem) {
      const wrapperRect = anchorWrapper.value.getBoundingClientRect()
      const itemRect = tocItem.getBoundingClientRect()

      // 计算需要滚动的距离
      const scrollTop = anchorWrapper.value.scrollTop + (itemRect.top - wrapperRect.top) - 50

      anchorWrapper.value.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  /**
   * 获取当前标题的子标题
   * @param parentIndex 当前标题的索引
   */
  const getSubHeadings = (parentIndex: number) => {
    const parentLevel = headings.value[parentIndex].level
    const result = []
    let i = parentIndex + 1

    // 收集直到下一个相同或更高级别标题之前的所有子标题
    while (i < headings.value.length && headings.value[i].level > parentLevel) {
      result.push(headings.value[i])
      i++
    }

    return result
  }

  /*监听页面滚动*/
  const handleScroll = useDebounceFn(() => {
    const currentHeading = getCurrentHeading()
    if (currentHeading) {
      scrollTocToHeading(currentHeading.id)
    }
  }, 100)

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <div class="bg-white rounded-2xl" v-if="hasHeadings">
    <client-only>
      <n-card hoverable>
        <template #header>
          <div class="flex justify-between items-center">
            <span>目录</span>
            <n-button icon-placement="right" text @click.stop="collapsed = !collapsed">
              {{ collapsed ? '展开' : '收起' }}
              <template #icon>
                <ChevronDownSharp v-if="collapsed" />
                <ChevronUp v-else />
              </template>
            </n-button>
          </div>
        </template>

        <div ref="anchorWrapper" class="anchor-wrapper" :class="{ 'anchor-collapsed': collapsed }">
          <n-anchor :bound="150" :top="88" style="z-index: 1" :ignore-gap="true">
            <template v-for="(heading, index) in headings" :key="heading.id">
              <n-anchor-link v-if="heading.level === 2" :title="heading.title" :href="`#${heading.id}`">
                <!-- 递归渲染子标题 -->
                <template v-if="index + 1 < headings.length">
                  <n-anchor-link
                    v-for="subHeading in getSubHeadings(index)"
                    :key="subHeading.id"
                    :title="subHeading.title"
                    :href="`#${subHeading.id}`"
                    :style="{
                      paddingLeft: `${(subHeading.level - 2) * 20}px`
                    }"
                  />
                </template>
              </n-anchor-link>
            </template>
          </n-anchor>
        </div>
      </n-card>
      <template #fallback>
        <div class="p-[15px]">
          <Skeleton text width="100%" />
          <Skeleton text width="100%" />
          <Skeleton text width="100%" />
        </div>
      </template>
    </client-only>
  </div>
</template>

<style scoped lang="scss">
  .anchor-wrapper {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-in-out;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #989b9f;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  .anchor-wrapper.anchor-collapsed {
    max-height: 0;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
  }

  :deep(.n-anchor-link__title) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

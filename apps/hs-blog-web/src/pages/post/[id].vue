<script setup lang="ts">
  import { addArticleViewCount, getArticleDetails } from '~/api/post'
  import License from './components/license.vue'
  import { useArticleSEO } from './components/useArticleSEO'
  import { HttpStatus } from '~/enums/httpStatus'
  import type { ArticleDetails } from '~/api/post/type'
  import authorInfo from './components/authorInfo.vue'
  import CommentSection from './components/CommentSection.vue'

  definePageMeta({
    layout: 'default'
  })

  const { scrollY } = useScrollWatcher()

  const route = useRoute()

  const isNavbarVisible = computed(() => {
    return scrollY.value === 0
  })
  const { data: articleData } = await useAsyncData('post', () => getArticleDetails({ id: Number(route.params.id) }), {
    default() {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {} as ArticleDetails
      }
    }
  })

  if (articleData.value && articleData.value.code === HttpStatus.OK) {
    useArticleSEO(articleData.value.data)
  } else {
    useArticleSEO(undefined)
  }

  const isPlayerExpanded = ref(false)

  /*切换播放器展开状态*/
  const togglePlayer = () => {
    isPlayerExpanded.value = !isPlayerExpanded.value
  }

  /*文章浏览量+1*/
  const handelAddArticleViewCount = async () => {
    await addArticleViewCount({ id: Number(route.params.id) })
  }

  onMounted(() => {
    handelAddArticleViewCount()
  })
</script>

<template>
  <div class="flex justify-center">
    <div>
      <div class="mt-[15px] bg-white py-[25px] w-full max-w-[900px] flex flex-col whitespace-normal rounded-2xl">
        <h1 class="flex text-[28px] font-600 whitespace-normal m-0 px-[15px]">{{ articleData.data.title }}</h1>
        <author-info :articleData="articleData.data" class="px-[15px]" />
        <markdown-renderer :markdown="articleData.data.content" />
        <client-only>
          <!--许可证-->
          <div class="flex justify-center px-[15px]">
            <license />
          </div>
          <template #fallback>
            <div class="p-[15px]">
              <Skeleton text width="50%" />
              <Skeleton text width="100%" />
            </div>
          </template>
        </client-only>
      </div>

      <!-- 添加评论区组件 -->
      <client-only>
        <comment-section 
          class="bg-white rounded-2xl mt-[20px] pb-[20px]" 
          :article-id="Number(route.params.id)" 
          :article-author-id="articleData.data.userId"
        />
      </client-only>
    </div>

    <!-- 移动端音频播放器 -->
    <div
      v-if="articleData.data.short_audio_url || articleData.data.long_audio_url"
      class="mobile-player md:hidden"
      :class="{ expanded: isPlayerExpanded }"
    >
      <!-- 展开/收起按钮 -->
      <div class="player-toggle" @click="togglePlayer">
        <div class="flex-center w-[24px]">
          <div class="aiPodcast">{{ isPlayerExpanded ? '收起' : 'AI播客' }}</div>
        </div>
      </div>
      <!-- 播放器内容 -->
      <div class="p-[15px] max-h-[80vh] overflow-y-auto">
        <div v-if="articleData.data.short_audio_url" class="mb-[10px]">
          <div class="mb-[5px] aiPodcast">文章概要</div>
          <audio :src="articleData.data.short_audio_url" controls class="w-full mt-2">您的浏览器不支持音频播放</audio>
        </div>

        <div v-if="articleData.data.long_audio_url">
          <div class="mb-[5px] aiPodcast">AI播客</div>
          <audio :src="articleData.data.long_audio_url" controls class="w-full mt-2">您的浏览器不支持音频播放</audio>
        </div>
      </div>
    </div>

    <!-- 桌面端右侧内容 -->
    <div class="content-right hidden md:block ml-[24px]" :class="{ 'header-hidden': !isNavbarVisible }">
      <div class="fixed w-[--sidebar-width]">
        <!-- pc端AI播客模块 -->
        <div
          v-if="articleData.data.short_audio_url || articleData.data.long_audio_url"
          class="bg-white p-[15px] mb-[20px] rounded-2xl"
        >
          <div v-if="articleData.data.short_audio_url" class="mb-[10px]">
            <div class="mb-[5px] aiPodcast">文章概要</div>
            <audio :src="articleData.data.short_audio_url" controls class="w-full mt-2">您的浏览器不支持音频播放</audio>
          </div>

          <div v-if="articleData.data.long_audio_url">
            <div class="mb-[5px] aiPodcast">AI播客</div>
            <audio :src="articleData.data.long_audio_url" controls class="w-full mt-2">您的浏览器不支持音频播放</audio>
          </div>
        </div>
        <!--  文章目录-->
        <markdown-anchor class="w-[330px]" :content="articleData.data.content" />
      </div>
    </div>

    <markdown-ai-analyzer />
  </div>
</template>

<style scoped lang="scss">
  .content-right {
    //--sidebar-width: 330px;
    width: var(--sidebar-width);
    position: relative;
    transition: top 0.2s ease-in-out;
    top: 15px;
  }

  .content-right.header-hidden {
    top: -60px;
  }

  .aiPodcast {
    background: radial-gradient(
      495.98% 195.09% at 144.79% 10.71%,
      #ff8a01 0,
      #b051b9 22.37%,
      #672bff 45.54%,
      #06f 99.99%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /*移动端适配样式*/
  @media (max-width: 768px) {
    .content-right {
      width: 100%;
    }

    :deep(p) {
      font-size: 16px;
    }
  }

  @media (max-width: 1300px) {
    .content-right {
      display: none;
    }
  }

  /*移动端播放器样式*/
  .mobile-player {
    position: fixed;
    right: -52px;
    bottom: 20%;
    transform: translateY(-50%);
    width: 300px;
    background: white;
    border-radius: 8px 0 0 8px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    z-index: 100;
    transform: translateX(250px); /*默认隐藏大部分*/
  }

  .mobile-player.expanded {
    transform: translateX(0); /*完全展开*/
    right: 0;
  }

  .player-toggle {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) translateX(-100%);
    background: white;
    padding: 5px 20px 5px 2px;
    border-radius: 8px 0 0 8px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    writing-mode: vertical-lr;
    text-orientation: upright;
  }

  /*音频播放器样式优化*/
  audio {
    width: 100%;
    height: 36px;
    border-radius: 18px;
  }

  /*确保在较小屏幕上播放器不会太宽*/
  @media (max-width: 375px) {
    .mobile-player {
      width: 260px;
      transform: translateX(210px);
    }

    .markdown-body {
      padding: 0 5px;
    }

    :deep(p) {
      font-size: 14px;
    }
  }
</style>

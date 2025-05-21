<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNavigationMenu } from './hook/useNavigationMenu'
  import SearchComponent from './searchComponent.vue'
  import { ReorderFour } from '@vicons/ionicons5'
  import { useUser } from '~/composables/useUser'

  onMounted(() => {})

  onUnmounted(() => {
    $off('search-focus-change')
  })

  const { token, showLoginModal } = useUser()
  const { $on, $off } = useNuxtApp()

  const router = useRouter()

  /**默认首页路径*/
  const currentPath = ref('')

  const { getMenuOptions, isActiveRoute } = useNavigationMenu()

  const { scrollY } = useScrollWatcher()

  const isSearchFocused = ref(false)

  const hasEnoughSpace = computed(() => {
    return window.innerWidth > 768
  })

  $on('search-focus-change', (focused: boolean) => {
    isSearchFocused.value = focused
  })

  const isNavbarVisible = computed(() => {
    return scrollY.value === 0
  })

  const dropdownOptions = computed(() => {
    return getMenuOptions.value.map(item => ({
      label: item.title,
      key: item.url
    }))
  })

  /*获取当前页面对应的菜单标题*/
  const getCurrentMenuTitle = computed(() => {
    const current = getMenuOptions.value.find(item => item.url === currentPath.value)
    return current?.title || '导航'
  })

  const handleSelect = (key: string) => {
    navigateTo(key)
  }
</script>

<template>
  <header class="header bg-white" :class="{ 'header-hidden': !isNavbarVisible }">
    <div class="header-container">
      <div class="flex items-center c-black dark:c-white">
        <div class="flex items-center py-[10px] mr-[5px] cursor-pointer" @click="router.push('/')">
          <nuxt-img height="25px" width="25px" src="svg/logo.svg" alt="logo" />
          <div class="logo-name ml-[5px] text-[21px] font-550">火山博客</div>
        </div>
        <div class="header-container-item hover:color-black" v-for="{ title, url } in getMenuOptions" :key="url">
          <nuxt-link :to="url" :class="{ active: isActiveRoute(url) }" class="cursor-pointer c-black dark:c-white">
            {{ title }}
          </nuxt-link>
        </div>
        <ClientOnly>
          <n-dropdown trigger="click" :options="dropdownOptions" @select="handleSelect" :value="currentPath">
            <div class="mobile-dropdown mx-[2px] c-blue flex">
              <div>{{ getCurrentMenuTitle }}</div>
              <n-icon size="20">
                <ReorderFour />
              </n-icon>
            </div>
          </n-dropdown>
        </ClientOnly>
      </div>
      <div class="flex items-center">
        <ClientOnly>
          <div class="search-wrapper">
            <SearchComponent />
            <div class="right-elements" :class="{ hidden: isSearchFocused && !hasEnoughSpace }">
              <n-button v-if="!token" @click="showLoginModal" class="ml-[10px]" type="primary" size="small">
                登录
              </n-button>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  @import url(./style.scss);

  .search-wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }

  .right-elements {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    opacity: 1;
    transform: translateX(0);
  }

  .right-elements.hidden {
    opacity: 0;
    transform: translateX(20px);
    pointer-events: none;
    width: 0;
    margin-left: 0;
  }
</style>

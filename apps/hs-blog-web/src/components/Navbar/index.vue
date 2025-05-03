<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNavigationMenu } from './hook/useNavigationMenu'
  import SearchComponent from './searchComponent.vue'
  import { ReorderFour } from '@vicons/ionicons5'

  const router = useRouter()

  /**默认首页路径*/
  const currentPath = ref('')

  const { getMenuOptions, isActiveRoute } = useNavigationMenu()

  const { scrollY } = useScrollWatcher()

  const isNavbarVisible = computed(() => {
    return scrollY.value === 0
  })

  onMounted(() => {})

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
        <SearchComponent />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  @import url(./style.scss);
</style>

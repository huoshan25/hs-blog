<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useNavigationMenu } from './hook/useNavigationMenu'
  import SearchComponent from './searchComponent.vue'
  import { PersonOutline, ReorderFour } from '@vicons/ionicons5'
  import { useUser } from '~/composables/useUser'
  import { getCurrentUserLevelInfo } from "~/api/user";
  import {HttpStatus} from "~/enums/httpStatus";

  onMounted(() => {
    if (isLogin.value) {
      fetchUserLevelInfo()
    }
  })

  onUnmounted(() => {
    $off('search-focus-change')
  })

  const { isLogin, showLoginModal, userInfo, clearUser } = useUser()
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

  const userInfoDialogShow = ref(false)

  const logout = () => {
    clearUser()
  }

  /** 用户等级信息 */
  const userLevel = ref({
    level: 'HY.1',
    points: 0,
    nextLevelPoints: 0,
    percentage: 0
  })

  /**获取用户等级信息*/
  const fetchUserLevelInfo = async () => {
    const res = await getCurrentUserLevelInfo()
    if (res.code === HttpStatus.OK) {
      userLevel.value = {
        level: res.data.currentLevel,
        points: res.data.points,
        nextLevelPoints: res.data.nextLevelPoints,
        percentage: res.data.percentage
      }
    }
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
            <div v-if="!isLogin" class="right-elements" :class="{ hidden: isSearchFocused && !hasEnoughSpace }">
              <n-button @click="showLoginModal" class="ml-[10px]" type="primary" size="small">登录</n-button>
            </div>
            <n-popover placement="bottom-end" trigger="click" v-else v-model:show="userInfoDialogShow">
              <template #trigger>
                <nuxt-img
                  :src="userInfo?.avatar"
                  class="w-[36px] h-[36px] radius-[50%] pl-[8px] cursor-pointer"
                  alt="avatar"
                />
              </template>
              <div class="py-[10px]">
                <div class="flex flex-col w-[224px] custom-border-bottom-1px-solid-#e4e6eb80 pb-[12px]">
                  <div class="flex mb-[16px]">
                    <nuxt-img
                      :src="userInfo?.avatar"
                      class="w-[48px] h-[48px] radius-[50%] pl-[8px] cursor-pointer mr-[12px]"
                      alt="avatar"
                    />
                    <div class="c-#252933 text-[16px]">{{ userInfo?.userName }}</div>
                  </div>

                  <div class="bg-#EDF4FF c-#1e80ff px-[8px] pt-[6px] pb-[8px] radius-[4px]">
                    <div class="mb-[3px] flex justify-between">
                      <div class="text-[12px]">
                        火友等级
                        <span class="font-600">{{ userLevel.level }}</span>
                      </div>
                      <div>{{ userLevel.points }} / {{ userLevel.nextLevelPoints }}</div>
                    </div>

                    <n-progress
                      :height="5"
                      color="#1E80FF"
                      type="line"
                      :show-indicator="false"
                      status="success"
                      :percentage="userLevel.percentage"
                    />
                  </div>
                </div>

<!--                <div class="custom-border-bottom-1px-solid-#e4e6eb80 py-[10px]">-->
<!--                  <div class="grid grid-cols-2 gap-2">-->
<!--                    <div class="flex items-center hover:bg-#F7F8FA cursor-pointer radius-[5px]">-->
<!--                      <n-icon class="m-[8px]" size="20">-->
<!--                        <PersonOutline />-->
<!--                      </n-icon>-->
<!--                      <div class="text-[14px] c-#252933">我的主页</div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

                <div class="mt-[12px] justify-between flex">
                  <div class="text-[12px] c-#8a919f hover:c-#1e80ff cursor-pointer">我的设置</div>
                  <n-popconfirm @positive-click="logout">
                    <template #trigger>
                      <div class="text-[12px] c-#8a919f hover:c-#1e80ff cursor-pointer">退出登录</div>
                    </template>
                    是否确认退出登录？
                  </n-popconfirm>
                </div>
              </div>
            </n-popover>
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

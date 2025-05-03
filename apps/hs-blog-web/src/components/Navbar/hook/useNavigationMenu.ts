export interface NavigationMenu {
  title: string
  url: string
}

/**
 * 导航栏菜单hook
 */
export const useNavigationMenu = () => {
  const staticPages = ['/profile', '/friendChains']

  const menuOptions = ref<NavigationMenu[]>(
    [
      {
        title: '首页',
        url: '/'
      },
      {
        title: '关于',
        url: '/profile'
      },
      {
        title: '友链',
        url: '/friendChains'
      },
    ]
  )
  const router = useRouter()
  const currentPath = ref(router.currentRoute.value.path)

  watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      currentPath.value = newPath
    }
  )

  const isActiveRoute = (url: string) => {
    if (url === '/blog') {
      return currentPath.value === '/blog' ||
        (currentPath.value.startsWith('/blog/') &&
          !staticPages.includes(currentPath.value))
    }
    return currentPath.value === url
  }

  const getMenuOptions = computed(() => menuOptions.value)

  return {
    getMenuOptions,
    isActiveRoute
  }
}

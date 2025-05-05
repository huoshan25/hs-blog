<script setup lang="ts">
import AppMain from './components/AppMain.vue'
import type { MenuOption } from 'naive-ui'
import { dateZhCN, zhCN } from 'naive-ui'
import { useThemeOverrides } from '@/layout/useThemeOverrides.ts'
import { useMenus } from '@/stores/useMenus.ts'
import Footer from '@/layout/components/Footer.vue'
import AppHeader from './components/AppHeader.vue'

onMounted(() => {})

const router = useRouter()

onMounted(() => {
  /**获取当前路由路径*/
  activeKey.value = router.currentRoute.value.path
  renewalCrumbs(menuOptions.value, activeKey.value)
})

/**是否反转*/
const inverted = ref(true)

/*主题覆盖*/
const { themeOverrides } = useThemeOverrides()

/**选中菜单项*/
const activeKey = ref<string>('')

/**菜单是否折叠*/
const collapsed = ref(false)

const { menuOptions } = useMenus()

/**菜单折叠事件*/
const handleFoldMenu = () => {
  collapsed.value = !collapsed.value
}

/**面包屑路径*/
const breadcrumbList = ref<string[]>([])

/**用于存储菜单树结构的扁平化数组 - 面包屑菜单*/
const dropdownOptions = ref<Record<number, MenuOption[]>>({})

/**
 * 处理菜单项选中事件
 * @param key 菜单项
 * @param item 菜单项原始数据
 */
const handleUpdateMenu = (key: string, item?: MenuOption) => {
  activeKey.value = key
  renewalCrumbs(menuOptions.value, key)
}

/**
 * 更新面包屑和下拉菜单选项
 * @param menuOptions 菜单数据
 * @param key 菜单项
 */
const renewalCrumbs = (menuOptions: MenuOption[], key: string) => {
  router.push(key)
  const path = findMenuPath(menuOptions, key)
  if (path) {
    breadcrumbList.value = path
    dropdownOptions.value = findDropdownOptions(menuOptions, path)
  }
}

/**
 * 递归查找菜单项的路径
 * @param options - 当前菜单项数组
 * @param key - 需要查找的菜单项的 key
 * @param path - 当前路径
 * @returns 路径数组或 null
 */
const findMenuPath = (options: MenuOption[], key: string, path: string[] = []): string[] | null => {
  for (const option of options) {
    const newPath = [...path, option.label as string]
    if (option.key === key) {
      return newPath
    }
    if (option.children) {
      const childPath = findMenuPath(option.children, key, newPath)
      if (childPath) {
        return childPath
      }
    }
  }
  return null
}

/**
 * 查找面包屑项的下拉菜单选项
 * @param options - 当前菜单项数组
 * @param path - 当前路径
 * @returns 各层级的下拉菜单选项
 */
const findDropdownOptions = (
  options: MenuOption[],
  path: string[],
): Record<number, MenuOption[]> => {
  const dropdowns: Record<number, MenuOption[]> = {}
  const findOptions = (opts: MenuOption[], p: string[], depth: number) => {
    const label = p[depth]
    for (const option of opts) {
      if (option.label === label) {
        if (option.children) {
          dropdowns[depth] = option.children
          findOptions(option.children, p, depth + 1)
        }
        break
      }
    }
  }
  findOptions(options, path, 0)
  return dropdowns
}

/**面包屑首页数据 - 一级菜单*/
const homeDropdownOptions: { label: any; key: string | number | undefined }[] =
  menuOptions.value.map((option: any) => ({
    label: option.label,
    key: option.key,
  }))

/**
 * 处理面包屑点击事件
 * @param index 面包屑项索引
 */
const handleBreadcrumbClick = (index: number) => {
  const path = breadcrumbList.value.slice(0, index + 1)
  const menuPath = findMenuPathByBreadcrumb(path, menuOptions.value)
  if (menuPath) {
    updateMenuAndBreadcrumb(menuPath)
    router.push(menuPath)
  }
}

/**
 * 根据面包屑路径查找菜单项路径
 * @param breadcrumbs 面包屑路径
 * @param options 菜单项
 * @returns 菜单项路径或 null
 */
const findMenuPathByBreadcrumb = (breadcrumbs: string[], options: MenuOption[]): string | null => {
  let currentOptions = options
  for (const breadcrumb of breadcrumbs) {
    const option = currentOptions.find((opt) => opt.label === breadcrumb)
    if (option) {
      if (option.children) {
        currentOptions = option.children
      } else {
        return option.key as string
      }
    } else {
      return null
    }
  }
  return null
}

/**
 * 查找菜单项路径
 * @param key 菜单项 key
 * @param options 菜单项数组
 * @returns 菜单项或 null
 */
const findMenuPathByKey = (key: string | number, options: MenuOption[]): MenuOption | null => {
  for (const option of options) {
    if (option.key === key) {
      return option
    }
    if (option.children) {
      const result = findMenuPathByKey(key, option.children)
      if (result) {
        return result
      }
    }
  }
  return null
}

/**
 * 查找菜单项的第一个子菜单项 key
 * @param option 菜单项
 * @returns 子菜单项 key 或 null
 */
const findFirstChildKey = (option: MenuOption): string | number | null => {
  if (option.children && option.children.length > 0) {
    return option.children[0].key ?? null
  }
  return null
}

/**
 * 处理下拉菜单选择事件
 * @param key 菜单项 key
 */
const handleDropdownSelect = (key: string) => {
  const menuPath = findMenuPathByKey(key, menuOptions.value)
  if (menuPath) {
    const firstChildKey = findFirstChildKey(menuPath) as string
    const navigateKey = firstChildKey || key
    router.push(navigateKey)
    updateMenuAndBreadcrumb(navigateKey)
  }
}

/**
 * 更新菜单和面包屑
 * @param key 菜单项 key
 */
const updateMenuAndBreadcrumb = (key: string) => {
  activeKey.value = key
  renewalCrumbs(menuOptions.value, key)
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-modal-provider>
            <n-layout has-sider class="layout">
              <n-layout-sider
                bordered
                :inverted="inverted"
                collapse-mode="width"
                :collapsed-width="64"
                :width="220"
                :collapsed="collapsed"
              >
                <div class="wrap-title" @click="handleDropdownSelect('/admin')">
                  <img src="/svg/logo.svg" class="h-[40px]" />
                  <div v-show="!collapsed" class="text">后台管理</div>
                </div>
                <n-menu
                  :inverted="inverted"
                  @update:value="handleUpdateMenu"
                  v-model:value="activeKey"
                  :collapsed="collapsed"
                  :collapsed-width="64"
                  :collapsed-icon-size="22"
                  :options="menuOptions"
                />
              </n-layout-sider>
              <div class="wrap scrollBar">
                <div class="header">
                  <div class="flex justify-center items-center">
                    <img
                        :src="collapsed ? '/svg/unfold.svg' : '/svg/shrink.svg'"
                        height="25"
                        class="p-[15px]"
                        @click="handleFoldMenu"
                    />
                    <n-breadcrumb class="ml-[25px]">
                      <n-breadcrumb-item>
                        <n-dropdown :options="homeDropdownOptions" @select="handleDropdownSelect">
                          <div class="trigger">首页</div>
                        </n-dropdown>
                      </n-breadcrumb-item>
                      <n-breadcrumb-item
                          v-for="(item, index) in breadcrumbList"
                          :key="item"
                          @click="handleBreadcrumbClick(index)"
                      >
                        <n-dropdown
                            v-if="dropdownOptions[index]"
                            :options="dropdownOptions[index]"
                            @select="handleDropdownSelect"
                        >
                          <div class="trigger">
                            {{ item }}
                          </div>
                        </n-dropdown>
                        <template v-else>
                          {{ item }}
                        </template>
                      </n-breadcrumb-item>
                    </n-breadcrumb>
                  </div>
                  <AppHeader/>
                </div>
                <main class="content">
                  <n-card class="radius-[16px]">
                    <AppMain />
                  </n-card>
                  <Footer />
                </main>
              </div>
            </n-layout>
          </n-modal-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  .wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #f5f5f5;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 12px;
      background-color: white;
    }

    .content {
      overflow-y: auto;
      padding: 20px 14px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
  }
}

.wrap-title {
  display: flex;
  padding: 14px 14px;
  align-content: center;
  white-space: nowrap;
  cursor: pointer;

  .text {
    margin-left: 10px;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>

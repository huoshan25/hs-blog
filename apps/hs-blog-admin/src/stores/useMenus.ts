import {CreateOutline, SpeedometerOutline, GitNetwork, PersonSharp, SettingsSharp} from "@vicons/ionicons5";
import {type MenuOption, NIcon} from "naive-ui";
import type {Component} from "vue";

/**转换图标*/
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, {default: () => h(icon)})
}

/**
 * 后台菜单配置
 */
export const useMenus = () => {

  /**菜单项*/
  const menuOptions = ref<MenuOption[]>([
    {
      label: '仪表盘',
      key: '/dashboard',
      icon: renderIcon(SpeedometerOutline),
    },
    {
      label: '文章管理',
      key: '/articleManage',
      icon: renderIcon(CreateOutline),
    },
    {
      label: '分类管理',
      key: '/categoryManage',
      icon: renderIcon(GitNetwork),
    },
    {
      label: '关于管理',
      key: '/profileManage',
      icon: renderIcon(PersonSharp),
    },
    {
      label: '系统设置',
      key: '/systemSettings',
      icon: renderIcon(SettingsSharp),
    },
  ])

  return {
    menuOptions
  }
}
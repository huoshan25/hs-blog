import {
  ChatboxEllipsesOutline,
  CreateOutline,
  GitNetwork,
  PeopleSharp,
  PersonSharp,
  SpeedometerOutline,
} from '@vicons/ionicons5'
import { type MenuOption, NIcon } from 'naive-ui'

// 显式定义 MenuOptionItem 类型来避免递归深度问题
export interface MenuOptionItem extends Omit<MenuOption, 'children'> {
  children?: MenuOptionItem[]
}

/**转换图标*/
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**
 * 后台菜单配置
 */
export const useMenus = () => {
  /**菜单项*/
  const menuOptions = ref<MenuOptionItem[]>([
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
      label: '评论管理',
      key: '/commentManage',
      icon: renderIcon(ChatboxEllipsesOutline),
    },
    {
      label: '关于管理',
      key: '/profileManage',
      icon: renderIcon(PersonSharp),
    },
    {
      label: '友链管理',
      key: '/linkManage',
      icon: renderIcon(PeopleSharp),
    },
  ])

  return {
    menuOptions,
  }
}

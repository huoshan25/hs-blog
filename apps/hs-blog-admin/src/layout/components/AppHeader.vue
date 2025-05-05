<script setup lang="ts">
import { LogOutOutline, NotificationsOutline, SettingsOutline } from '@vicons/ionicons5'
import { NIcon, useDialog, useMessage } from 'naive-ui'
import type { Component } from 'vue'

const router = useRouter()
const { userInfo, clearUserInfo } = useUser()
const dialog = useDialog()
const message = useMessage()

/**退出登录*/
const handleLogout = () => {
  dialog.warning({
    title: '退出登录',
    content: '确定要退出系统吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      clearUserInfo()
      router.push('/login')
      message.success('已安全退出系统')
    },
  })
}

/**下拉菜单选项*/
const menuOptions = computed(() => [
  {
    key: 'settings',
    label: '个人设置',
    icon: renderIcon(SettingsOutline),
  },
  {
    key: 'divider',
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: renderIcon(LogOutOutline),
  },
])

const handleSelect = (key: string) => {
  if (key === 'logout') {
    handleLogout()
  } else if (key === 'settings') {
    router.push('/profileManage')
  }
}

/**转换图标*/
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**获取用户首字母头像*/
const userInitial = computed(() => {
  if (!userInfo.value?.userName || userInfo.value?.userName.length === 0) {
    return 'A'
  }

  return userInfo.value?.userName[0]
})

/**随机头像背景色*/
const avatarColor = computed(() => {
  const colors = ['#2080f0', '#0C8918', '#d03050', '#9500FF', '#8378EA', '#F1BB4E']
  const charCode = userInitial.value.charCodeAt(0)
  return colors[charCode % colors.length]
})
</script>

<template>
  <div class="flex justify-center items-center pr-[20px]">
    <!-- 通知按钮 -->
    <n-badge :value="0" :show="false" dot processing>
      <n-button quaternary circle>
        <template #icon>
          <n-icon :component="NotificationsOutline" />
        </template>
      </n-button>
    </n-badge>

    <!-- 用户菜单 -->
    <n-dropdown trigger="click" :options="menuOptions" @select="handleSelect">
      <div class="user-dropdown">
        <n-avatar round :style="{ backgroundColor: avatarColor }" :size="38">
          {{ userInitial }}
        </n-avatar>
        <div class="user-info">
          <span class="username">{{ userInfo?.userName || '管理员' }}</span>
          <span class="role">{{ userInfo?.role || '管理员' }}</span>
        </div>
      </div>
    </n-dropdown>
  </div>
</template>

<style scoped lang="scss">
.header-left {
  display: flex;
  align-items: center;

  .logo {
    h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  .user-info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .username {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 1.2;
    }

    .role {
      font-size: 12px;
      color: #999;
      line-height: 1;
    }
  }
}

// 适应暗黑模式
:deep(.n-dropdown-menu) {
  max-width: none !important;
}
</style>

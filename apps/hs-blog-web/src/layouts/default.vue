<script setup lang="ts">
  import { dateZhCN, zhCN } from 'naive-ui'
  import { consoleLogInfo } from '~/composables/logInfo'
  import LoginModal from '~/components/LoginModal/index.vue'

  onMounted(() => {
    consoleLogInfo()
  })

  /*主题色覆盖*/
  const { themeOverrides } = useThemeOverrides()

  const { loginModalVisible } = useUser()
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <n-message-provider>
        <n-modal-provider>
          <div class="flex flex-col h-[100vh]">
            <Navbar />
            <div class="mt-[70px]">
              <slot />
            </div>
            <Footer />
            <LoginModal v-if="loginModalVisible" />
          </div>
        </n-modal-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped></style>

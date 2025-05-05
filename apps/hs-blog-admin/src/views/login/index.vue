<script setup lang="ts">
import { getLogin } from '@/api/user'
import { HttpStatus } from '@/enums/httpStatus'
import type { loginReq } from '@/api/user/type'
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
import { dateZhCN, zhCN } from 'naive-ui'
import { useThemeOverrides } from '@/layout/useThemeOverrides.ts'

const router = useRouter()

const { setToken, fetchUserInfo } = useUser()

const loginForm = ref<loginReq>({
  usernameOrEmail: '',
  password: '',
})

const formRef = ref()
const loading = ref(false)
const errorMessage = ref('')

const loginRules = {
  usernameOrEmail: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
}

const handleLogin = async () => {
  try {
    errorMessage.value = ''
    await formRef.value?.validate()
    loading.value = true

    const res = await getLogin(loginForm.value)
    if (res.code === HttpStatus.OK) {
      setToken(res.data.accessToken, res.data.refreshToken)
      fetchUserInfo()
      await router.push('/dashboard')
    } else {
      errorMessage.value = res.message || '登录失败，请检查用户名和密码'
    }
  } catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}

/*主题覆盖*/
const { themeOverrides } = useThemeOverrides()
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/svg/logo.svg" alt="Logo" class="login-logo" />
          <h1 class="login-title">后台管理系统</h1>
        </div>

        <n-form
          ref="formRef"
          :model="loginForm"
          :rules="loginRules"
          label-placement="left"
          label-width="0"
          size="large"
          @keydown="handleKeyDown"
        >
          <n-form-item path="usernameOrEmail">
            <n-input v-model:value="loginForm.usernameOrEmail" placeholder="用户名" clearable>
              <template #prefix>
                <n-icon>
                  <person-outline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="password">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              show-password-on="click"
              placeholder="密码"
            >
              <template #prefix>
                <n-icon>
                  <lock-closed-outline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <n-form-item>
            <n-button type="info" block :loading="loading" @click="handleLogin"> 登录</n-button>
          </n-form-item>
        </n-form>

        <div class="login-footer">
          <p>© {{ new Date().getFullYear() }} 个人博客管理系统</p>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>

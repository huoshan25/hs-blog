<script setup lang="ts">
  import { type LoginReq, type RegisterReq, useUser } from '~/composables/useUser'
  import type { FormInst, FormRules } from 'naive-ui'
  import AgreementCheckbox from './AgreementCheckbox.vue'
  import { useStorage } from '@vueuse/core'
  import { getEmailCode } from '@/api/user'
  import { HttpStatus } from '~/enums/httpStatus'
  import TheLockIcon from '~/components/Icon/TheLockIcon.vue'
  import EmailIcon from '~/components/Icon/EmailIcon.vue'
  import UserIcon from '~/components/Icon/UserIcon.vue'

  const { loginModalVisible, hideLoginModal, fetchLogin, fetchRegister } = useUser()

  const router = useRouter()

  const message = useMessage()
  const activeTab = useStorage<string>('loginActiveTab', () => 'login')
  const formRef = ref<FormInst | null>(null)

  /** 登录表单数据 */
  const loginForm = reactive<LoginReq>({
    usernameOrEmail: '',
    password: ''
  })

  /** 切换标签页 */
  const switchTab = (tab: string) => {
    activeTab.value = tab
  }

  const registerForm = reactive<RegisterReq>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    agreeTerms: false
  })

  /** 验证码倒计时 */
  const countdown = ref(0)
  const buttonText = computed(() => (countdown.value > 0 ? `${countdown.value}秒后重试` : '发送验证码'))
  const isButtonDisabled = computed(() => countdown.value > 0)

  /** 开始倒计时 */
  const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }

  /** 登录表单规则 */
  const loginRules: FormRules = {
    usernameOrEmail: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
    ]
  }

  /** 注册表单规则 */
  const registerRules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value) => {
          return value === registerForm.password
        },
        message: '两次输入的密码不一致',
        trigger: 'blur'
      }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        validator: (rule, value) => {
          const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
          return emailRegex.test(value)
        },
        message: '邮箱格式不正确',
        trigger: 'blur'
      }
    ],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    agreeTerms: [
      {
        validator: (rule, value) => value === true,
        message: '请阅读并同意服务条款和隐私政策',
        trigger: 'change'
      }
    ]
  }

  const handleLogin = () => {
    formRef.value?.validate(async errors => {
      if (errors) return

      const success = await fetchLogin(loginForm)
      if (success) {
        message.success('登录成功')
        resetLoginForm()
      }
    })
  }

  /** 注册 */
  const handleRegister = () => {
    formRef.value?.validate(async errors => {
      if (errors) return

      if (!registerForm.agreeTerms) {
        message.warning('请阅读并同意服务条款和隐私政策')
        return
      }

      const success = await fetchRegister(registerForm)
      if (success) {
        message.success('注册成功')
        switchTab('login')
        resetRegisterForm()
      }
    })
  }

  /** 发送验证码 */
  const sendCode = async () => {
    if (!registerForm.email) {
      message.warning('请输入邮箱')
      return
    }

    const res = await getEmailCode({ email: registerForm.email })
    if (res.code === HttpStatus.OK) {
      message.success('验证码已发送')
      startCountdown()
    }
  }

  /** 重置登录表单 */
  const resetLoginForm = () => {
    loginForm.usernameOrEmail = ''
    loginForm.password = ''
    if (formRef.value) formRef.value.restoreValidation()
  }

  /** 重置注册表单 */
  const resetRegisterForm = () => {
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.email = ''
    registerForm.code = ''
    registerForm.agreeTerms = false
    if (formRef.value) formRef.value.restoreValidation()
  }

  /** 切换标签时重置表单 */
  const handleSwitchTab = (tab: string) => {
    switchTab(tab)
    if (tab === 'login') {
      resetLoginForm()
    } else {
      resetRegisterForm()
    }
  }
</script>

<template>
  <n-modal
    v-model:show="loginModalVisible"
    preset="card"
    transform-origin="center"
    class="login-modal"
    style="width: 360px; max-width: 90vw"
    :mask-closable="false"
  >
    <!-- Logo区域 -->
    <div class="flex items-center justify-center mb-6">
      <img src="/svg/logo.svg" alt="logo" class="w-[50px] h-[50px]" />
      <div class="ml-3">
        <span
          class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
        >
          火山博客
        </span>
        <div class="h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-400 mt-0.5"></div>
      </div>
    </div>

    <!-- 切换标签 -->
    <div class="flex mb-5 relative">
      <div
        class="flex-1 text-center py-2.5 cursor-pointer transition-all duration-300 relative z-10"
        :class="activeTab === 'login' ? 'text-blue-600 font-medium' : 'text-gray-500'"
        @click="handleSwitchTab('login')"
      >
        登录
      </div>
      <div
        class="flex-1 text-center py-2.5 cursor-pointer transition-all duration-300 relative z-10"
        :class="activeTab === 'register' ? 'text-blue-600 font-medium' : 'text-gray-500'"
        @click="handleSwitchTab('register')"
      >
        注册
      </div>
      <!-- 滑动的下划线 -->
      <div
        class="absolute bottom-0 h-0.5 w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300"
        :style="{ transform: `translateX(${activeTab === 'login' ? '0' : '100'}%)` }"
      ></div>
    </div>

    <!-- 表单容器 -->
    <div>
      <n-form
        ref="formRef"
        :model="activeTab === 'login' ? loginForm : registerForm"
        :rules="activeTab === 'login' ? loginRules : registerRules"
        size="large"
      >
        <!-- 登录表单 -->
        <template v-if="activeTab === 'login'">
          <n-form-item label="用户名/邮箱" path="usernameOrEmail">
            <n-input
              v-model:value="loginForm.usernameOrEmail"
              placeholder="请输入用户名或邮箱"
              clearable
              class="rounded-lg"
            >
              <template #prefix>
                <n-icon>
                  <user-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
              show-password-on="click"
              class="rounded-lg"
            >
              <template #prefix>
                <n-icon>
                  <the-lock-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <div class="flex justify-between items-center mb-4">
            <n-checkbox>记住我</n-checkbox>
            <n-button text type="primary" size="small">忘记密码？</n-button>
          </div>

          <n-button type="primary" block @click="handleLogin" :loading="false" class="h-11 rounded-lg login-button">
            登录
          </n-button>
        </template>

        <!-- 注册表单 -->
        <template v-else class="flex">
          <n-form-item label="用户名" path="username">
            <n-input v-model:value="registerForm.username" placeholder="请输入用户名" clearable class="rounded-lg">
              <template #prefix>
                <n-icon>
                  <user-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="registerForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
              show-password-on="click"
              class="rounded-lg"
            >
              <template #prefix>
                <n-icon>
                  <the-lock-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="确认密码" path="confirmPassword">
            <n-input
              v-model:value="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              clearable
              show-password-on="click"
              class="rounded-lg"
            >
              <template #prefix>
                <n-icon>
                  <the-lock-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="邮箱" path="email">
            <n-input v-model:value="registerForm.email" placeholder="请输入邮箱" clearable class="rounded-lg">
              <template #prefix>
                <n-icon>
                  <email-icon />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="验证码" path="code">
            <n-grid :cols="24" :x-gap="8">
              <n-grid-item :span="15">
                <n-input v-model:value="registerForm.code" placeholder="请输入验证码" clearable class="rounded-lg">
                  <template #prefix>
                    <n-icon>
                      <the-lock-icon />
                    </n-icon>
                  </template>
                </n-input>
              </n-grid-item>
              <n-grid-item :span="9">
                <n-button
                  type="primary"
                  :disabled="isButtonDisabled"
                  @click="sendCode"
                  class="h-10 code-button w-full rounded-lg"
                >
                  {{ buttonText }}
                </n-button>
              </n-grid-item>
            </n-grid>
          </n-form-item>

          <n-form-item path="agreeTerms">
            <agreement-checkbox v-model:checked="registerForm.agreeTerms" />
          </n-form-item>

          <n-button type="primary" block @click="handleRegister" :loading="false" class="h-11 rounded-lg login-button">
            注册
          </n-button>
        </template>
      </n-form>
    </div>

    <template #footer>
      <div class="text-xs text-gray-500 text-center">
        登录即表示您同意我们的
        <n-button
          text
          type="primary"
          size="tiny"
          @click="
            () => {
              hideLoginModal()
              router.push('/terms')
            }
          "
        >
          服务条款
        </n-button>
        和
        <n-button
          text
          type="primary"
          size="tiny"
          @click="
            () => {
              hideLoginModal()
              router.push('/privacy')
            }
          "
        >
          隐私政策
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
  .login-button {
    background: linear-gradient(to right, #3b82f6, #6366f1);
    border: none;
    transition: all 0.3s;
  }

  .login-button:hover {
    opacity: 0.9;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
  }

  .code-button {
    background: linear-gradient(to right, #3b82f6, #6366f1);
    border: none;
  }

  .code-button:disabled {
    opacity: 0.5;
    background: linear-gradient(to right, #3b82f6, #6366f1);
  }

  :deep(.n-form-item-label) {
    padding-left: 4px;
    font-size: 14px;
  }

  :deep(.n-modal-mask) {
    backdrop-filter: blur(2px);
  }

  :deep(.n-modal-body-wrapper) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 动画效果 */
  .login-modal:deep(.n-modal) {
    transform-origin: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>

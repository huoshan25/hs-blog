<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInst, FormRules, UploadFileInfo, UploadInst } from 'naive-ui'
import { useUser } from '~/composables/useUser'
import { updatePassword, updateUserInfo } from '~/api/user'
import { HttpStatus } from '~/enums/httpStatus'
import { useMessage } from 'naive-ui'

const userSettingsShow = defineModel<boolean>('show')

const message = useMessage()

const { userInfo, clearUser, token, updateUserAvatar } = useUser()
const { apiBaseUrl } = useRuntimeConfig().public
console.log(apiBaseUrl,'apiBaseUrl')

const uploadRef = ref<UploadInst | null>(null)
const fileList = ref<UploadFileInfo[]>([])
const avatarUrl = ref(userInfo.value?.avatar || '')

/**上传组件配置*/
const uploadConfig = {
  action: `${apiBaseUrl}/blog/user/avatar`,
  headers: {
    Authorization: `Bearer ${token.value}`
  },
  name: 'file' // 文件字段名
}

/**用户信息表单*/
const userFormRef = ref<FormInst | null>(null)
const userForm = reactive({
  userName: userInfo.value?.userName || '',
  email: userInfo.value?.email || '',
  position: userInfo.value?.position || ''
})

/**用户信息表单规则*/
const userFormRules: FormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  position: [
    { max: 50, message: '职位长度不能超过50个字符', trigger: 'blur' }
  ]
}

const passwordFormRef = ref<FormInst | null>(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === passwordForm.newPassword
      },
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ]
}

const activeTab = ref('profile')

const handleClose = () => {
  userSettingsShow.value = false
}

/**提交密码修改*/
const handleUpdatePassword = async (e: Event) => {
  e.preventDefault()
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate()
  const res = await updatePassword(passwordForm)

  if (res.code === HttpStatus.OK) {
    message.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    clearUser()
    handleClose()
  }
}

/**重置密码表单*/
const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.restoreValidation()
  }
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

/**处理头像上传*/
const handleUploadChange = async (options: any) => {
  const file = options.fileList[0].file
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await updateUserAvatar(formData)
    if (res) {
      avatarUrl.value = res.data.avatar
      message.success('头像更新成功!')
    }
  }
}

/**提交用户信息修改*/
const handleUpdateUserInfo = async (e: Event) => {
  e.preventDefault()
  if (!userFormRef.value) return

  await userFormRef.value.validate()
  const res = await updateUserInfo(userForm)

  if (res.code === HttpStatus.OK) {
    message.success(res.message)
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        userName: userForm.userName,
        email: userForm.email,
        position: userForm.position
      }
    }
  }
}

/**重置用户信息表单*/
const resetUserForm = () => {
  if (userFormRef.value) {
    userFormRef.value.restoreValidation()
  }
  userForm.userName = userInfo.value?.userName || ''
  userForm.email = userInfo.value?.email || ''
  userForm.position = userInfo.value?.position || ''
}
</script>

<template>
  <n-modal
    v-model:show="userSettingsShow"
    preset="dialog"
    title="个人设置"
    :mask-closable="false"
    style="width: 600px"
    @close="handleClose"
  >
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="profile" tab="个人信息">
        <n-form
          ref="userFormRef"
          :model="userForm"
          :rules="userFormRules"
          label-placement="left"
          label-width="100px"
          require-mark-placement="right-hanging"
        >
          <div class="flex flex-col items-center mb-6">
            <n-avatar
              :src="avatarUrl || '/img/default-avatar.png'"
              round
              :size="100"
              class="mb-4"
            />
            <n-upload
              :action="uploadConfig.action"
              :headers="uploadConfig.headers"
              :name="uploadConfig.name"
              :file-list="fileList"
              :max="1"
              accept="image/*"
              @change="handleUploadChange"
            >
              <n-button>更换头像</n-button>
            </n-upload>
            <div class="text-sm text-gray-500 mt-2">
              支持 jpg、jpeg、png 格式，文件大小不超过 2MB
            </div>
          </div>
          
          <n-form-item label="用户名" path="userName">
            <n-input
              v-model:value="userForm.userName"
              placeholder="请输入用户名"
            />
          </n-form-item>
          
          <n-form-item label="邮箱" path="email">
            <n-input
              disabled
              v-model:value="userForm.email"
              placeholder="请输入邮箱"
            />
          </n-form-item>
          
          <n-form-item label="职位" path="position">
            <n-input
              v-model:value="userForm.position"
              placeholder="请输入您的职位"
            />
          </n-form-item>
          
          <div class="flex justify-end mt-4">
            <n-button class="mr-2" @click="resetUserForm">重置</n-button>
            <n-button type="primary" @click="handleUpdateUserInfo">保存修改</n-button>
          </div>
        </n-form>
      </n-tab-pane>
      
      <n-tab-pane name="password" tab="修改密码">
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
          label-width="100px"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="旧密码" path="oldPassword">
            <n-input
              v-model:value="passwordForm.oldPassword"
              type="password"
              placeholder="请输入旧密码"
              show-password-on="click"
            />
          </n-form-item>
          
          <n-form-item label="新密码" path="newPassword">
            <n-input
              v-model:value="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password-on="click"
            />
          </n-form-item>
          
          <n-form-item label="确认新密码" path="confirmPassword">
            <n-input
              v-model:value="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password-on="click"
            />
          </n-form-item>
          
          <div class="flex justify-end mt-4">
            <n-button class="mr-2" @click="resetPasswordForm">重置</n-button>
            <n-button type="primary" @click="handleUpdatePassword">确认修改</n-button>
          </div>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<style scoped>
.n-upload-trigger {
  width: 100%;
}
</style> 
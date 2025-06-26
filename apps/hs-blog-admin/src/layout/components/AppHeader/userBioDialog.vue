<script setup lang="ts">
import { HttpStatus } from '@/enums/httpStatus'
import { getUserBio, putUserBio } from '@/api/user'

onMounted(() => {
  getBioInfo()
})

const triggerFileInput = (id: string) => {
  document.getElementById(id)?.click()
}

const message = useMessage()

const getBioInfo = async () => {
  const res = await getUserBio()
  if (res.code === HttpStatus.OK) {
    userForm.value = res.data
  }
}

const userBioDialogShow = defineModel<boolean>()

const userFormRules = {
  name: {
    required: true,
    message: '请输入用户名称',
    trigger: 'blur',
  },
}

const userForm = ref({
  bgImg: '',
  avatar: '',
  name: '',
  description: '',
})

// 上传背景图片
const handleBackgroundUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      userForm.value.bgImg = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

/**
 * 上传头像
 * @param e
 */
const handleAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      userForm.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

/**
 * 保存用户信息
 */
const handleSaveUserInfo = async () => {
  const res = await putUserBio(userForm.value)
  if (res.code === HttpStatus.OK) {
    message.success(res.message)
    handleCancelEdit()
  }
}

/**取消编辑*/
const handleCancelEdit = () => {
  userBioDialogShow.value = false
}
</script>

<template>
  <div class="user-bio-form">
    <n-form
      ref="userFormRef"
      :model="userForm"
      :rules="userFormRules"
      label-placement="left"
      label-width="100px"
    >
      <div class="flex justify-center my-[30px]">
        <div class="personal">
          <div class="personal-contents">
            <div
              class="top-bgImg"
              :style="{
                backgroundImage: userForm.bgImg ? `url(${userForm.bgImg})` : 'none',
              }"
            ></div>
            <div class="personal-introduced">
              <img
                class="personal-introduced-avatar"
                :src="userForm.avatar"
                alt="avatar"
                width="65px"
                height="65px"
              />
            </div>
            <div class="personal-introduced-name">{{ userForm?.name || '请输入用户名' }}</div>
            <div class="personal-introduced-description">
              {{ userForm?.description || '请输入个人描述' }}
            </div>
          </div>
        </div>
      </div>

      <n-form-item label="背景图片" path="bgImg">
        <div class="upload-container">
          <n-button @click="() => triggerFileInput('bgImageUpload')">
            选择背景图片
          </n-button>
          <input
            type="file"
            id="bgImageUpload"
            accept="image/*"
            style="display: none"
            @change="handleBackgroundUpload"
          />
          <span class="upload-tip" v-if="userForm.bgImg">已选择图片</span>
          <span class="upload-tip" v-else>未选择图片</span>
        </div>
      </n-form-item>

      <n-form-item label="头像" path="avatar">
        <div class="upload-container">
          <n-button @click="() => triggerFileInput('avatarUpload')">
            选择头像
          </n-button>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style="display: none"
            @change="handleAvatarUpload"
          />
          <span class="upload-tip" v-if="userForm.avatar">已选择图片</span>
          <span class="upload-tip" v-else>未选择图片</span>
        </div>
      </n-form-item>

      <n-form-item label="用户名称" path="name">
        <n-input v-model:value="userForm.name" placeholder="请输入用户名称" />
      </n-form-item>

      <n-form-item label="个人描述" path="description">
        <n-input
          v-model:value="userForm.description"
          type="textarea"
          placeholder="请输入个人描述"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </n-form-item>
    </n-form>
  </div>
  <div class="text-right">
    <n-button class="mr-[8px]" @click="handleCancelEdit">取消</n-button>
    <n-button type="primary" @click="handleSaveUserInfo">保存</n-button>
  </div>
</template>

<style scoped lang="scss">
.user-bio-form {
  padding: 10px;

  .bg-preview-container {
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;

    .bg-preview {
      height: 180px;
      background-color: #f5f5f5;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: 20px;
      border-radius: 8px;
      position: relative;

      .profile-content {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 15px;

        .avatar-container {
          margin-right: 15px;

          .avatar-preview {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }

        .profile-text {
          flex: 1;

          .profile-name {
            font-size: 18px;
            font-weight: 500;
            color: #333;
            margin-bottom: 5px;
          }

          .profile-description {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }

  .upload-container {
    display: flex;
    align-items: center;

    .upload-tip {
      margin-left: 10px;
      font-size: 14px;
      color: #999;
    }
  }
}

.personal {
  width: 300px;
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;
  border: 1px solid #eee;

  &-contents {
    width: 100%;
    flex-grow: 1;

    .top-bgImg {
      object-fit: cover;
      background-position-x: center;
      background-position-y: center;
      background-size: cover;
      min-height: 120px;
      width: 100%;
      overflow: hidden;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      position: relative;

      &:after {
        content: '';
        width: 100%;
        height: 40%;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(to top, #fff, transparent);
      }
    }

    .personal-introduced {
      text-align: center;

      &-avatar {
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border: rgba(255, 255, 255, 0.4) 4px solid;
        width: 59px;
        height: 59px;
        border-radius: 50%;
      }
    }

    .personal-introduced-name {
      font-size: 20px;
      font-weight: 900;
      color: #212529;
      margin-top: 40px;
      margin-bottom: 5px;
      text-align: center;
    }

    .personal-introduced-description {
      text-align: center;
      color: #a6a5a5;
      padding: 0 25px;
      margin-bottom: 10px;
    }
  }
}
</style>

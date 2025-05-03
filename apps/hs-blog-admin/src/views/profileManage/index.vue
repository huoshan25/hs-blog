<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { getProfileInfo, type ProfileInfoRes, saveProfileInfo } from '@/api/profileManage'
import { HttpStatus } from '@/enums/httpStatus'

const formRef = ref<FormInst | null>(null)

const loading = ref(false)

const message = useMessage()

const formData = ref<ProfileInfoRes>({
  name: '',
  title: '',
  description: '',
  bio: [],
  skills: [
    {
      name: '',
      items: [],
    },
  ],
  projects: [
    {
      name: '',
      description: '',
      tech: [],
      link: '',
    },
  ],
  contacts: [
    {
      platform: '',
      link: '',
      icon: '',
    },
  ],
  seo: {
    description: '',
    keywords: '',
    ogDescription: '',
    title: '',
    twitterDescription: '',
  },
})

/*获取个人信息数据*/
const loadProfileInfo = async () => {
  const res = await getProfileInfo()
  if (res.code === HttpStatus.OK) {
    formData.value = res.data
  }
}

const rules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
  title: {
    required: true,
    message: '请输入职位',
    trigger: 'blur',
  },
  description: {
    required: true,
    message: '请输入描述',
    trigger: 'blur',
  },
}

/*Bio列表动态操作*/
const handleAddBio = () => {
  if (!formData.value) return
  formData.value.bio.push('')
}

const handleRemoveBio = (index: number) => {
  if (!formData.value) return
  formData.value.bio.splice(index, 1)
}

/*技能列表动态操作*/
const handleAddSkillCategory = () => {
  if (!formData.value) return
  formData.value.skills.push({
    name: '',
    items: [],
  })
}

const handleRemoveSkillCategory = (index: number) => {
  if (!formData.value) return
  formData.value.skills.splice(index, 1)
}

const handleAddSkillItem = (categoryIndex: number) => {
  if (!formData.value) return
  formData.value.skills[categoryIndex].items.push({
    name: '',
  })
}

const handleRemoveSkillItem = (categoryIndex: number, itemIndex: number) => {
  if (!formData.value) return
  formData.value.skills[categoryIndex].items.splice(itemIndex, 1)
}

/*项目列表动态操作*/
const handleAddProject = () => {
  if (!formData.value) return
  formData.value.projects.push({
    name: '',
    description: '',
    tech: [],
    link: '',
  })
}

const handleRemoveProject = (index: number) => {
  if (!formData.value) return
  formData.value.projects.splice(index, 1)
}

/*联系方式动态操作*/
const handleAddContact = () => {
  if (!formData.value) return
  formData.value.contacts.push({
    platform: '',
    link: '',
    icon: '',
  })
}

const handleRemoveContact = (index: number) => {
  if (!formData.value) return
  formData.value.contacts.splice(index, 1)
}

/*提交表单*/
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true
    const res = await saveProfileInfo(formData.value)
    if (res.code === HttpStatus.OK) {
      message.success('更新成功')
      await loadProfileInfo()
    }
  } catch (error) {
    message.error('更新失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfileInfo()
})
</script>

<template>
  <div class="p-[6px]">
    <div class="mb-[6px]">
      <h1 class="font-bold">个人信息管理</h1>
    </div>

    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="100"
      require-mark-placement="right-hanging"
    >
      <n-card title="基本信息" class="mb-[6px]">
        <n-form-item label="名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入名称" />
        </n-form-item>

        <n-form-item label="职位" path="title">
          <n-input v-model:value="formData.title" placeholder="请输入职位" />
        </n-form-item>

        <n-form-item label="描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入描述" />
        </n-form-item>
      </n-card>

      <n-card title="个人简介" class="mb-[6px]">
        <div v-for="(item, index) in formData.bio" :key="index" class="mb-[4px]">
          <div class="flex items-center gap-[4px]">
            <n-input v-model:value="formData.bio[index]" placeholder="请输入简介项" />
            <n-button type="error" @click="handleRemoveBio(index)">删除</n-button>
          </div>
        </div>
        <n-button type="primary" @click="handleAddBio">添加简介项</n-button>
      </n-card>

      <n-card title="技能栈" class="mb-[6px]">
        <div v-for="(category, categoryIndex) in formData.skills" :key="categoryIndex" class="mb-[6px]">
          <div class="flex items-center gap-[4px] mb-[4px]">
            <n-input v-model:value="category.name" placeholder="请输入分类名称" />
            <n-button type="error" @click="handleRemoveSkillCategory(categoryIndex)"
              >删除分类</n-button
            >
          </div>

          <div v-for="(item, itemIndex) in category.items" :key="itemIndex" class="ml-[8px] mb-[4px]">
            <div class="flex items-center gap-[4px]">
              <n-input v-model:value="item.name" placeholder="请输入技能名称" />
              <n-button type="error" @click="handleRemoveSkillItem(categoryIndex, itemIndex)"
                >删除技能</n-button
              >
            </div>
          </div>

          <n-button type="primary" class="ml-[8px]" @click="handleAddSkillItem(categoryIndex)"
            >添加技能</n-button
          >
        </div>
        <n-button type="primary" @click="handleAddSkillCategory">添加技能分类</n-button>
      </n-card>

      <n-card title="项目经历" class="mb-[6px]">
        <div v-for="(project, index) in formData.projects" :key="index" class="mb-[6px]">
          <div class="flex justify-end mb-[4px]">
            <n-button type="error" @click="handleRemoveProject(index)">删除项目</n-button>
          </div>

          <n-form-item label="项目名称">
            <n-input v-model:value="project.name" placeholder="请输入项目名称" />
          </n-form-item>

          <n-form-item label="项目描述">
            <n-input
              v-model:value="project.description"
              type="textarea"
              placeholder="请输入项目描述"
            />
          </n-form-item>

          <n-form-item label="技术栈">
            <n-dynamic-tags v-model:value="project.tech" />
          </n-form-item>

          <n-form-item label="项目链接">
            <n-input v-model:value="project.link" placeholder="请输入项目链接" />
          </n-form-item>
        </div>
        <n-button type="primary" @click="handleAddProject">添加项目</n-button>
      </n-card>

      <n-card title="联系方式" class="mb-[6px]">
        <div v-for="(contact, index) in formData.contacts" :key="index" class="mb-[6px]">
          <div class="flex justify-end mb-[4px]">
            <n-button type="error" @click="handleRemoveContact(index)">删除联系方式</n-button>
          </div>

          <n-form-item label="平台名称">
            <n-input v-model:value="contact.platform" placeholder="请输入平台名称" />
          </n-form-item>

          <n-form-item label="链接">
            <n-input v-model:value="contact.link" placeholder="请输入链接" />
          </n-form-item>

          <n-form-item label="图标">
            <n-input v-model:value="contact.icon" placeholder="请输入图标路径" />
          </n-form-item>
        </div>
        <n-button type="primary" @click="handleAddContact">添加联系方式</n-button>
      </n-card>

      <n-card title="关于页面-SEO设置" class="mb-[6px]">
        <n-form-item label="页面标题" path="seo.title">
          <n-input v-model:value="formData.seo.title" placeholder="请输入页面标题" />
        </n-form-item>

        <n-form-item label="页面描述" path="seo.description">
          <n-input
            v-model:value="formData.seo.description"
            type="textarea"
            placeholder="请输入页面描述"
          />
        </n-form-item>

        <n-form-item label="关键词" path="seo.keywords">
          <n-input
            v-model:value="formData.seo.keywords"
            type="textarea"
            placeholder="请输入关键词"
          />
        </n-form-item>

        <n-form-item label="OG描述" path="seo.ogDescription">
          <n-input
            v-model:value="formData.seo.ogDescription"
            type="textarea"
            placeholder="请输入OG描述"
          />
        </n-form-item>

        <n-form-item label="Twitter描述" path="seo.twitterDescription">
          <n-input
            v-model:value="formData.seo.twitterDescription"
            type="textarea"
            placeholder="请输入Twitter描述"
          />
        </n-form-item>
      </n-card>

      <div class="flex justify-center">
        <n-button type="primary" size="large" :loading="loading" @click="handleSubmit">
          保存更新
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped>
.n-card {
  margin-bottom: 24px;
}
</style>

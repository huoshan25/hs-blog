<script setup lang="ts">
import { HttpStatus } from '@/enums/httpStatus'
import {
  generateLongAudio,
  generateShortAudio,
  getArticleDetails,
  updateArticleTTS,
} from '@/api/article'
import type { ArticleTTSReq } from '@/api/article/type'

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
  articleId: {
    type: Number,
    required: true,
  },
})

const message = useMessage()

const form = ref<ArticleTTSReq>({
  id: props.articleId,
  short_content: '',
  short_audio_url: '',
  long_content: '',
  long_audio_url: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)

/*生成短文本音频*/
const handleGenerateShort = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await generateShortAudio({
      content: props.markdown,
      articleUUID: props.articleId,
    })

    if (res.code === HttpStatus.OK) {
      form.value.short_content = res.data.content
      form.value.short_audio_url = res.data.url
    }
  } catch (err) {
    console.error('产生短音频错误:', err)
    error.value = '生成音频失败'
  } finally {
    isLoading.value = false
  }
}

/*生成对话音频*/
const handleGenerateLong = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await generateLongAudio({
      content: props.markdown,
      articleUUID: props.articleId,
    })

    if (response.code === HttpStatus.OK) {
      form.value.long_content = response.data.content
      form.value.long_audio_url = response.data.url
    }
  } catch (err) {
    console.error('产生长音频错误:', err)
    error.value = '生成对话音频失败'
  } finally {
    isLoading.value = false
  }
}

const saveContent = async () => {
  const res = await updateArticleTTS(form.value)
  if (res.code === HttpStatus.OK) {
    message.success('保存成功')
  }
}

defineExpose({
  saveContent,
})

onMounted(async () => {
  const res = await getArticleDetails({ id: props.articleId })
  if (res.code === HttpStatus.OK) {
    form.value.short_content = res.data.short_content
    form.value.short_audio_url = res.data.short_audio_url
    form.value.long_content = res.data.long_content
    form.value.long_audio_url = res.data.long_audio_url
  }
})
</script>

<template>
  <div class="flex flex-col">
    <n-button :loading="isLoading" @click="handleGenerateShort" type="primary">
      生成摘要音频
    </n-button>
    <!-- 短文本部分 -->
    <div class="short-content">
      <div v-if="form.short_content" class="mt-2 p-4 bg-gray-50 rounded">
        {{ form.short_content }}
      </div>
    </div>
    <audio
      v-if="form.short_audio_url"
      :src="form.short_audio_url"
      controls
      class="w-full mt-2 mb-[10px]"
    >
      您的浏览器不支持音频播放
    </audio>

    <n-button :loading="isLoading" @click="handleGenerateLong" type="primary">
      生成对话音频
    </n-button>
    <!-- 对话部分 -->
    <div class="long-content mt-4 overflow-auto h-[300px]">
      <div v-if="form.long_content" class="mt-2 p-4 bg-gray-50 rounded">
        <pre class="whitespace-pre-wrap">{{ form.long_content }}</pre>
      </div>
    </div>
    <audio v-if="form.long_audio_url" :src="form.long_audio_url" controls class="w-full mt-2">
      您的浏览器不支持音频播放
    </audio>

    <n-alert v-if="error" type="error" :show-icon="true">
      {{ error }}
    </n-alert>
  </div>
</template>

<style scoped lang="scss">
.short-content,
.long-content {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>

<script setup lang="ts">
import { getArticleComments, createComment, deleteComment } from '~/api/post'
import type { CommentData } from '~/api/post/type'
import { useUser } from '~/composables/useUser'

const props = defineProps<{
  articleId: number
}>()

const { user, token, showLoginModal } = useUser()
const commentContent = ref('')
const replyTo = ref<{ id: number; username: string } | null>(null)
const comments = ref<CommentData[]>([])
const isSubmitting = ref(false)
const loading = ref(true)
const message = useMessage()

// 获取评论列表
const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getArticleComments(props.articleId)
    if (res.code === 200) {
      comments.value = res.data
    }
  } catch (error) {
    console.error('获取评论失败', error)
  } finally {
    loading.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!token.value) {
    message.warning('请先登录后再发表评论')
    return
  }

  if (!commentContent.value.trim()) {
    message.warning('评论内容不能为空')
    return
  }

  isSubmitting.value = true
  try {
    const data = {
      content: commentContent.value,
      articleId: props.articleId,
      parentId: replyTo.value?.id
    }

    const res = await createComment(data)
    if (res.code === 200 || res.code === 201) {
      message.success('评论发布成功')
      commentContent.value = ''
      replyTo.value = null
      await fetchComments()
    }
  } catch (error) {
    console.error('发布评论失败', error)
    message.error('发布评论失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 回复评论
const replyToComment = (comment: CommentData) => {
  if (!token.value) {
    message.warning('请先登录后再回复评论')
    return
  }
  
  replyTo.value = {
    id: comment.id,
    username: comment.user.username
  }
  // 滚动到评论框
  document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' })
}

// 取消回复
const cancelReply = () => {
  replyTo.value = null
}

// 删除评论
const handleDeleteComment = async (id: number) => {
  if (!token.value) {
    return
  }

  try {
    await deleteComment(id)
    message.success('评论删除成功')
    await fetchComments()
  } catch (error) {
    console.error('删除评论失败', error)
    message.error('删除评论失败，请稍后重试')
  }
}

// 格式化时间
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 判断当前登录用户是否是评论作者
const isCommentAuthor = (comment: CommentData) => {
  return !!token.value && user.value?.id === comment.userId
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="comment-section mt-8 px-[15px]">
    <h2 class="text-xl font-semibold mb-4">评论区</h2>
    
    <!-- 评论输入框 -->
    <div class="comment-input mb-6" id="comment-input">
      <div v-if="replyTo" class="reply-info mb-2 text-sm text-gray-500 flex items-center">
        <span>回复 @{{ replyTo.username }}：</span>
        <button @click="cancelReply" class="ml-2 text-blue-500 text-xs">取消回复</button>
      </div>
      
      <n-input
        v-model:value="commentContent"
        type="textarea"
        placeholder="写下你的评论..."
        :rows="4"
        :disabled="!token || isSubmitting"
      />
      
      <div class="flex justify-between mt-2">
        <div v-if="!token" class="text-sm text-gray-500">
          请先<n-button text type="info" @click="showLoginModal">登录</n-button>后发表评论
        </div>
        <div v-else class="text-sm text-gray-500">
          评论将以 {{ user?.username }} 的身份发布
        </div>
        
        <n-button 
          type="primary" 
          :loading="isSubmitting" 
          :disabled="!token || !commentContent.trim()" 
          @click="submitComment"
        >
          发布评论
        </n-button>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comment-list">
      <n-spin :show="loading">
        <template v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment.id" class="comment-item mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-start">
              <!-- 用户头像 -->
              <div class="flex-shrink-0 mr-3">
                <n-avatar
                  :src="comment.user.avatar || '/img/default-avatar.png'"
                  fallback-src="/img/default-avatar.png"
                  round
                />
              </div>
              
              <!-- 评论内容 -->
              <div class="flex-grow">
                <div class="flex items-center">
                  <span class="font-semibold">{{ comment.user.username }}</span>
                  <span class="text-xs text-gray-500 ml-2">{{ formatDate(comment.createdAt) }}</span>
                </div>
                
                <div class="mt-1">
                  <p v-if="comment.parentId" class="text-sm text-gray-500 mb-1">
                    回复 @{{ comments.find(c => c.id === comment.parentId)?.user.username || '已删除的评论' }}
                  </p>
                  <p class="whitespace-pre-wrap break-words">{{ comment.content }}</p>
                </div>
                
                <div class="mt-2 flex">
                  <n-button text type="primary" size="small" @click="replyToComment(comment)">
                    回复
                  </n-button>
                  
                  <n-button 
                    v-if="isCommentAuthor(comment)"
                    text 
                    type="error" 
                    size="small" 
                    class="ml-2"
                    @click="handleDeleteComment(comment.id)"
                  >
                    删除
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <n-empty v-else description="暂无评论，快来发表第一条评论吧！" />
      </n-spin>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.comment-item {
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}
</style> 
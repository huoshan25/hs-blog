<script setup lang="ts">
  import { createComment, deleteComment, getArticleComments } from '~/api/post'
  import type { CommentData } from '~/api/post/type'
  import { useUser } from '~/composables/useUser'
  import { useTimeFormat } from '~/composables/useTimeFormat'

  const props = defineProps<{
    articleId: number
  }>()

  const { user, token, showLoginModal } = useUser()
  const commentContent = ref('')
  const mainCommentContent = ref('')
  const replyTo = ref<{ id: number; userName: string; isTopLevel: boolean } | null>(null)
  const activeReplyId = ref<number | null>(null)
  const comments = ref<CommentData[]>([])
  const isSubmitting = ref(false)
  const loading = ref(true)
  const message = useMessage()

  // 结构化评论数据，将回复评论嵌套在父评论下
  const structuredComments = computed(() => {
    // 顶级评论
    const topLevelComments = comments.value.filter(c => !c.parentId)

    // 将回复评论组织到对应的父评论下
    return topLevelComments.map(comment => {
      const replies = comments.value.filter(c => c.parentId === comment.id)
      return {
        ...comment,
        replies
      }
    })
  })

  // 获取父评论用户名
  const getParentUserName = (parentId: number | null) => {
    if (!parentId) return null
    const parent = comments.value.find(c => c.id === parentId)
    return parent?.user.userName || '未知用户'
  }

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

  // 提交主评论
  const submitComment = async () => {
    if (!token.value) {
      message.warning('请先登录后再发表评论')
      return
    }

    if (!mainCommentContent.value.trim()) {
      message.warning('评论内容不能为空')
      return
    }

    isSubmitting.value = true
    try {
      const data = {
        content: mainCommentContent.value,
        articleId: props.articleId
      }

      const res = await createComment(data)
      if (res.code === 200 || res.code === 201) {
        message.success('评论发布成功')
        mainCommentContent.value = ''
        await fetchComments()
      }
    } catch (error) {
      console.error('发布评论失败', error)
      message.error('发布评论失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  }

  // 提交回复
  const submitReply = async () => {
    if (!token.value) {
      message.warning('请先登录后再回复评论')
      return
    }

    if (!commentContent.value.trim()) {
      message.warning('回复内容不能为空')
      return
    }

    if (!replyTo.value) {
      message.warning('回复目标不存在')
      return
    }

    isSubmitting.value = true
    try {
      const data = {
        content: commentContent.value,
        articleId: props.articleId,
        parentId: replyTo.value.id
      }

      const res = await createComment(data)
      if (res.code === 200 || res.code === 201) {
        message.success('回复发布成功')
        commentContent.value = ''
        replyTo.value = null
        activeReplyId.value = null
        await fetchComments()
      }
    } catch (error) {
      console.error('发布回复失败', error)
      message.error('发布回复失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  }

  // 打开回复框
  const openReplyBox = (comment: CommentData, isTopLevel = true) => {
    if (!token.value) {
      message.warning('请先登录后再回复评论')
      return
    }

    // 已经打开了当前评论的回复框，则关闭它
    if (activeReplyId.value === comment.id) {
      activeReplyId.value = null
      replyTo.value = null
      commentContent.value = ''
      return
    }

    replyTo.value = {
      id: comment.id,
      userName: comment.user.userName,
      isTopLevel
    }
    activeReplyId.value = comment.id
    commentContent.value = ''

    // 等待DOM更新后聚焦到回复框
    nextTick(() => {
      const replyInput = document.getElementById(`reply-input-${comment.id}`)
      if (replyInput) {
        ;(replyInput as HTMLTextAreaElement).focus()
      }
    })
  }

  // 取消回复
  const cancelReply = () => {
    replyTo.value = null
    activeReplyId.value = null
    commentContent.value = ''
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
  <div class="comment-section p-[15px]">
    <h2 class="text-xl font-semibold mb-4">评论 {{ comments.length }}</h2>

    <!-- 主评论输入框 -->
    <div class="comment-input mb-6" id="comment-input">
      <n-input
        show-count
        clearable
        maxlength="1000"
        v-model:value="mainCommentContent"
        type="textarea"
        placeholder="平等表达，友善交流"
        :rows="4"
        :disabled="!token"
      />

      <div class="flex justify-between mt-2">
        <div v-if="!token" class="text-sm text-gray-500">
          请先
          <n-button text type="info" @click="showLoginModal">登录</n-button>
          后发表评论
        </div>

        <n-button
          type="primary"
          :loading="isSubmitting"
          :disabled="!token || !mainCommentContent.trim()"
          @click="submitComment"
        >
          发布评论
        </n-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <n-spin :show="loading">
        <template v-if="structuredComments.length > 0">
          <!-- 顶级评论 -->
          <div v-for="comment in structuredComments" :key="comment.id" class="comment-item mb-4">
            <div class="comment-main p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
              <div class="flex items-start">
                <!-- 用户头像 -->
                <div class="flex-shrink-0 mr-3">
                  <n-avatar
                    :src="comment.user.avatar || '/img/default-avatar.png'"
                    fallback-src="/img/default-avatar.png"
                    round
                    size="medium"
                  />
                </div>

                <!-- 评论内容 -->
                <div class="flex-grow">
                  <div class="flex items-center">
                    <span class="font-semibold text-[15px]">{{ comment.user.userName }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{ useTimeFormat(comment.createdAt) }}</span>
                  </div>

                  <div class="mt-2">
                    <p class="whitespace-pre-wrap break-words text-gray-800">{{ comment.content }}</p>
                  </div>

                  <div class="mt-3 flex">
                    <n-button text type="primary" size="small" @click="openReplyBox(comment)">
                      <template #icon>
                        <div class="i-carbon-reply text-sm mr-1"></div>
                      </template>
                      回复
                    </n-button>

                    <n-button
                      v-if="isCommentAuthor(comment)"
                      text
                      type="error"
                      size="small"
                      class="ml-4"
                      @click="handleDeleteComment(comment.id)"
                    >
                      <template #icon>
                        <div class="i-carbon-trash-can text-sm mr-1"></div>
                      </template>
                      删除
                    </n-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 回复评论框 -->
            <div
              v-if="activeReplyId === comment.id"
              class="reply-box ml-10 mt-2 mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center mb-2">
                <n-tag type="info" size="small" class="mr-2">回复</n-tag>
                <span class="font-medium">@{{ replyTo?.userName }}</span>
              </div>

              <n-input
                show-count
                clearable
                v-model:value="commentContent"
                type="textarea"
                maxlength="1000"
                :placeholder="`回复 ${replyTo?.userName}...`"
                :id="`reply-input-${comment.id}`"
                :rows="3"
                :disabled="isSubmitting"
              />

              <div class="flex justify-end mt-2">
                <n-button size="small" class="mr-2" @click="cancelReply">取消</n-button>
                <n-button
                  type="primary"
                  size="small"
                  :loading="isSubmitting"
                  :disabled="!commentContent.trim()"
                  @click="submitReply"
                >
                  发布回复
                </n-button>
              </div>
            </div>

            <!-- 二级评论/回复 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies ml-10 mt-2">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="reply-item py-3 px-4 mb-2 bg-gray-50 rounded-lg border-l-4 border-l-gray-200"
              >
                <div class="flex items-start">
                  <!-- 用户头像 -->
                  <div class="flex-shrink-0 mr-2">
                    <n-avatar
                      :src="reply.user.avatar || '/img/default-avatar.png'"
                      fallback-src="/img/default-avatar.png"
                      round
                      size="small"
                    />
                  </div>

                  <!-- 回复内容 -->
                  <div class="flex-grow">
                    <div class="flex items-center">
                      <span class="font-medium text-sm">{{ reply.user.userName }}</span>
                      <span class="text-xs text-gray-400 mx-1">回复</span>
                      <span class="font-medium text-sm text-blue-500">{{ comment.user.userName }}</span>
                      <span class="text-xs text-gray-500 ml-2">{{ useTimeFormat(reply.createdAt, true) }}</span>
                    </div>

                    <div class="mt-1">
                      <p class="text-sm whitespace-pre-wrap break-words text-gray-700">{{ reply.content }}</p>
                    </div>

                    <div class="mt-2 flex">
                      <n-button text type="primary" size="tiny" @click="openReplyBox(comment, false)">回复</n-button>

                      <n-button
                        v-if="isCommentAuthor(reply)"
                        text
                        type="error"
                        size="tiny"
                        class="ml-3"
                        @click="handleDeleteComment(reply.id)"
                      >
                        删除
                      </n-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回复评论框（二级） -->
              <div
                v-if="activeReplyId === comment.id && !replyTo?.isTopLevel"
                class="reply-box mt-1 mb-2 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div class="flex items-center mb-2">
                  <n-tag type="info" size="small" class="mr-2">回复</n-tag>
                  <span class="font-medium">@{{ replyTo?.userName }}</span>
                </div>

                <n-input
                  v-model:value="commentContent"
                  type="textarea"
                  :placeholder="`回复 ${replyTo?.userName}...`"
                  :id="`reply-input-${comment.id}`"
                  :rows="3"
                  :disabled="isSubmitting"
                />

                <div class="flex justify-end mt-2">
                  <n-button size="small" class="mr-2" @click="cancelReply">取消</n-button>
                  <n-button
                    type="primary"
                    size="small"
                    :loading="isSubmitting"
                    :disabled="!commentContent.trim()"
                    @click="submitReply"
                  >
                    发布回复
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
  }

  .reply-item {
    transition: all 0.2s ease;

    &:hover {
      background-color: #f7f7f7;
      border-left-color: #d1d5db;
    }
  }

  .comment-main {
    &:hover {
      border-color: #e5e7eb;
    }
  }

  .reply-box {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
